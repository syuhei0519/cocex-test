<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisteredUserController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => ['required', 'string', 'max:64'],
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

        $email = $request->string('email')->trim()->lower()->toString();

        if (User::query()->where('email', $email)->exists()) {
            return response()->json([
                'title' => 'Conflict',
                'status' => 409,
                'detail' => '既に登録済みのメールアドレスです。',
            ], 409);
        }

        $user = User::query()->create([
            'name' => $request->string('name')->trim()->toString(),
            'email' => $email,
            'password' => $request->string('password')->toString(),
        ]);

        event(new Registered($user));

        return response()->json([
            'message' => '登録確認メールを送信しました。',
            'requiresEmailVerification' => true,
        ], 201);
    }
}
