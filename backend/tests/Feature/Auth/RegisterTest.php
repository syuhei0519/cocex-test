<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

it('registers a user and sends a verification email', function (): void {
    Notification::fake();

    $response = $this->postJson('/api/auth/register', [
        'name' => '家計管理ユーザー',
        'email' => 'User@Example.com',
        'password' => 'passw0rd!',
    ]);

    $response->assertCreated()->assertJson([
        'message' => '登録確認メールを送信しました。',
        'requiresEmailVerification' => true,
    ]);

    $user = User::query()->first();
    expect($user)->not->toBeNull();
    expect($user?->email)->toBe('user@example.com');
    expect($user?->hasVerifiedEmail())->toBeFalse();

    Notification::assertSentTo($user, VerifyEmail::class);
});

it('dispatches registered event on user signup', function (): void {
    Event::fake();

    $this->postJson('/api/auth/register', [
        'name' => 'イベント検証',
        'email' => 'event@example.com',
        'password' => 'passw0rd!',
    ]);

    Event::assertDispatched(Registered::class);
});

it('rejects duplicate email registration with conflict response', function (): void {
    User::factory()->create([
        'email' => 'dup@example.com',
    ]);

    $response = $this->postJson('/api/auth/register', [
        'name' => '重複さん',
        'email' => 'dup@example.com',
        'password' => 'passw0rd!',
    ]);

    $response->assertStatus(409)->assertJson([
        'title' => 'Conflict',
        'status' => 409,
    ]);
});

it('validates required fields on registration', function (): void {
    $response = $this->postJson('/api/auth/register', []);

    $response->assertStatus(400)->assertJson([
        'title' => 'Bad Request',
        'status' => 400,
    ]);

    expect($response->json('errors'))->toHaveKeys(['name', 'email', 'password']);
});
