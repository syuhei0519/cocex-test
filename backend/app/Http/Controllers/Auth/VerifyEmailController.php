<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::query()->find($id);

        if ($user === null) {
            return response()->json([
                'title' => 'Not Found',
                'status' => 404,
                'detail' => 'ユーザーが見つかりません。',
            ], 404);
        }

        if (! URL::hasValidSignature($request)) {
            return response()->json([
                'title' => 'Bad Request',
                'status' => 400,
                'detail' => 'メール確認リンクが無効または期限切れです。',
            ], 400);
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json([
                'title' => 'Bad Request',
                'status' => 400,
                'detail' => 'メール確認ハッシュが一致しません。',
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'メールアドレスは既に確認済みです。',
            ]);
        }

        $user->markEmailAsVerified();

        event(new Verified($user));

        return response()->json([
            'message' => 'メールアドレスを確認しました。',
        ]);
    }
}
