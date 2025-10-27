<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

<<<<<<< HEAD
// 正常な入力でプロファイルが更新されることを検証する
=======
>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
it('updates the authenticated user profile', function (): void {
    $user = User::factory()->create([
        'name' => '旧プロフィール名',
        'locale' => 'en',
        'currency' => 'USD',
    ]);

    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/users/me', [
        'name' => '新しい名前',
        'locale' => 'ja-jp',
        'currency' => 'jpy',
    ]);

    $response->assertOk()
        ->assertJsonPath('name', '新しい名前')
        ->assertJsonPath('locale', 'ja-JP')
        ->assertJsonPath('currency', 'JPY');

    $freshUser = $user->fresh();

    expect($freshUser?->name)->toBe('新しい名前')
        ->and($freshUser?->locale)->toBe('ja-JP')
        ->and($freshUser?->currency)->toBe('JPY');
});

<<<<<<< HEAD
// 未認証のユーザーは更新できないことを検証する
=======
>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
it('requires authentication to update the profile', function (): void {
    $response = $this->patchJson('/api/users/me', [
        'name' => '未ログイン',
    ]);

    $response->assertStatus(401)->assertJson([
        'message' => 'Unauthenticated.',
    ]);
});

<<<<<<< HEAD
// リクエストボディが空の場合にバリデーションが失敗することを検証する
=======
>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
it('validates that at least one field is provided', function (): void {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/users/me', []);

    $response->assertStatus(400)->assertJson([
        'title' => 'Bad Request',
        'status' => 400,
    ])->assertJsonStructure([
        'errors' => ['body'],
    ]);
});

<<<<<<< HEAD
// 通貨コードが3文字でない場合にバリデーションエラーとなることを検証する
=======
>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
it('validates the currency format', function (): void {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/users/me', [
        'currency' => 'JP',
    ]);

    $response->assertStatus(400)->assertJson([
        'title' => 'Bad Request',
        'status' => 400,
    ])->assertJsonStructure([
        'errors' => ['currency'],
    ]);
});
<<<<<<< HEAD
=======

>>>>>>> 23cc63ae258e79a8c303c1718742754089eb6945
