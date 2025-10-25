<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
                'remember' => ['sometimes', 'boolean'],
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
            'password' => $request->string('password')->toString(),
        ];

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return response()->json([
                'title' => 'Unauthorized',
                'status' => 401,
                'detail' => 'メールアドレスまたはパスワードが正しくありません。',
            ], 401);
        }

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        /** @var \App\Models\User $user */
        $user = $request->user();

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => UserResource::make($user)->resolve(),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();

        if ($user !== null) {
            $currentToken = $user->currentAccessToken();

            if ($currentToken instanceof PersonalAccessToken) {
                $currentToken->delete();
            } else {
                $user->tokens()->delete();
            }
        }

        if ($request->hasSession()) {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(null, 204);
    }
}
