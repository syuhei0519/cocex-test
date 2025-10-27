<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

// 正常なメールアドレスでリセットリンクを送信できることを検証する
it('sends password reset link for valid email', function (): void {
    Notification::fake();

    $user = User::factory()->create([
        'email' => 'reset-user@example.com',
    ]);

    $response = $this->postJson('/api/auth/password/forgot', [
        'email' => 'reset-user@example.com',
    ]);

    $response->assertStatus(202)->assertJson([
        'message' => 'パスワードリセットメールを送信しました。',
    ]);

    Notification::assertSentTo($user, ResetPassword::class);
});

// 未登録メールでも情報を漏らさず同じレスポンスを返すことを検証する
it('returns accepted even when email does not exist', function (): void {
    Notification::fake();

    $response = $this->postJson('/api/auth/password/forgot', [
        'email' => 'unknown@example.com',
    ]);

    $response->assertStatus(202)->assertJson([
        'message' => 'パスワードリセットメールを送信しました。',
    ]);

    Notification::assertNothingSent();
});

// メールフォーマットが不正な場合にバリデーションエラーとなることを検証する
it('validates email when requesting password reset', function (): void {
    $response = $this->postJson('/api/auth/password/forgot', [
        'email' => 'invalid-email',
    ]);

    $response->assertStatus(400)->assertJsonStructure([
        'errors' => ['email'],
    ]);
});

// 正しいトークンでパスワードが更新されることを検証する
it('resets password with valid token', function (): void {
    $user = User::factory()->create([
        'password' => 'OldPass123!',
    ]);

    $user->createToken('legacy');

    $token = Password::broker()->createToken($user);

    $response = $this->postJson('/api/auth/password/reset', [
        'email' => $user->email,
        'token' => $token,
        'password' => 'NewP@ssw0rd',
    ]);

    $response->assertNoContent();

    expect(Hash::check('NewP@ssw0rd', $user->fresh()?->password))->toBeTrue()
        ->and($user->fresh()?->tokens)->toHaveCount(0);
});

// 不正なトークンでリセットできず 410 を返却することを検証する
it('returns gone when token is invalid', function (): void {
    $user = User::factory()->create();

    $response = $this->postJson('/api/auth/password/reset', [
        'email' => $user->email,
        'token' => 'invalid-token',
        'password' => 'NewP@ssw0rd',
    ]);

    $response->assertStatus(410)->assertJson([
        'title' => 'Gone',
        'status' => 410,
    ]);
});

// 入力不足の場合にバリデーションエラーとなることを検証する
it('validates required fields on password reset', function (): void {
    $response = $this->postJson('/api/auth/password/reset', []);

    $response->assertStatus(400)->assertJsonStructure([
        'errors' => ['token', 'email', 'password'],
    ]);
});
