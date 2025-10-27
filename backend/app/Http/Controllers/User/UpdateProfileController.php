<?php

declare(strict_types=1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UpdateProfileController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => ['sometimes', 'string', 'max:64', 'filled'],
                'locale' => ['sometimes', 'string', 'max:10', 'filled'],
                'currency' => ['sometimes', 'string', 'size:3', 'alpha', 'filled'],
            ]
        );

<<<<<<< HEAD
        // どの項目も指定されていない場合はリクエスト全体をエラー扱いにする
=======
>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
        $validator->after(function ($validator) use ($request): void {
            if (! $request->hasAny(['name', 'locale', 'currency'])) {
                $validator->errors()->add('body', '更新する項目を1つ以上指定してください。');
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'title' => 'Bad Request',
                'status' => 400,
                'errors' => $validator->errors()->toArray(),
            ], 400);
        }

        /** @var \App\Models\User $user */
        $user = $request->user();

        $updates = [];

        if ($request->has('name')) {
            $updates['name'] = $request->string('name')->trim()->toString();
        }

        if ($request->has('locale')) {
<<<<<<< HEAD
            // ja-jp / ja_JP といった入力を ja-JP 形式へ正規化する
=======
>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
            $locale = str_replace('_', '-', $request->string('locale')->trim()->toString());

            if (str_contains($locale, '-')) {
                [$language, $region] = explode('-', $locale, 2);
                $updates['locale'] = strtolower($language).'-'.strtoupper($region);
            } else {
                $updates['locale'] = strtolower($locale);
            }
        }

        if ($request->has('currency')) {
<<<<<<< HEAD
            // ISO 通貨コードは大文字3桁へ統一する
=======
>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
            $updates['currency'] = strtoupper($request->string('currency')->trim()->toString());
        }

        if ($updates !== []) {
            $user->fill($updates);
            $user->save();
        }

        return response()->json(UserResource::make($user->fresh())->resolve());
    }
}
