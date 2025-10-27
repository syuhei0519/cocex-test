<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class ForgotPasswordController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => ['required', 'string', 'email'],
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'title' => 'Bad Request',
                'status' => 400,
                'errors' => $validator->errors()->toArray(),
            ], 400);
        }

        $email = $request->string('email')->trim()->lower()->toString();

        $baseUrl = rtrim((string) (config('app.frontend_password_reset_url') ?? config('app.url')), '/');

        ResetPassword::createUrlUsing(function (User $user, string $token) use ($baseUrl): string {
            $query = http_build_query([
                'token' => $token,
                'email' => $user->getEmailForPasswordReset(),
            ]);

            return "{$baseUrl}/reset-password?{$query}";
        });

        Password::sendResetLink(['email' => $email]);

        return response()->json([
            'message' => 'パスワードリセットメールを送信しました。',
        ], 202);
    }
}
