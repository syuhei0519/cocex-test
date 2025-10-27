<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'token' => ['required', 'string'],
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string', 'min:8'],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'title' => 'Bad Request',
                'status' => 400,
                'errors' => $validator->errors()->toArray(),
            ], 400);
        }

        $credentials = [
            'email' => $request->string('email')->trim()->lower()->toString(),
            'token' => $request->string('token')->toString(),
            'password' => $request->string('password')->toString(),
        ];

        $status = Password::reset($credentials, function (User $user, string $password): void {
            $user->forceFill([
                'password' => $password,
                'remember_token' => Str::random(60),
            ])->save();

            if (method_exists($user, 'tokens')) {
                $user->tokens()->delete();
            }

            event(new PasswordReset($user));
        });

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(null, 204);
        }

        if ($status === Password::INVALID_TOKEN) {
            return response()->json([
                'title' => 'Gone',
                'status' => 410,
                'detail' => 'パスワードリセットトークンの有効期限が切れています。',
            ], 410);
        }

        return response()->json([
            'title' => 'Bad Request',
            'status' => 400,
            'detail' => 'パスワードリセットに失敗しました。',
        ], 400);
    }
}
