<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json([
                'title' => 'Unauthorized',
                'status' => 401,
                'detail' => '認証が必要です。',
            ], 401);
        }

        if (! $user instanceof MustVerifyEmail) {
            return response()->json([
                'title' => 'Bad Request',
                'status' => 400,
                'detail' => 'このユーザーはメール確認に対応していません。',
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'メールアドレスは既に確認済みです。',
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => '確認メールを再送しました。',
        ], 202);
    }
}
