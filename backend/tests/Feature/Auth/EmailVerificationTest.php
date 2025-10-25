<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('verifies an email with a valid signature', function (): void {
    $user = User::factory()->unverified()->create();
    Event::fake([Verified::class]);

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]
    );

    $response = $this->getJson($verificationUrl);

    $response->assertOk()->assertJson([
        'message' => 'メールアドレスを確認しました。',
    ]);

    Event::assertDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

it('returns message when email is already verified', function (): void {
    $user = User::factory()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]
    );

    $response = $this->getJson($verificationUrl);

    $response->assertOk()->assertJson([
        'message' => 'メールアドレスは既に確認済みです。',
    ]);
});

it('rejects verification links with invalid signatures', function (): void {
    $user = User::factory()->unverified()->create();

    $invalidUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->subMinutes(1),
        [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ]
    );

    $response = $this->getJson($invalidUrl);

    $response->assertStatus(400)->assertJson([
        'title' => 'Bad Request',
        'status' => 400,
    ]);
});

it('returns not found when user does not exist', function (): void {
    $user = User::factory()->unverified()->create();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id + 1,
            'hash' => sha1($user->getEmailForVerification()),
        ]
    );

    $response = $this->getJson($verificationUrl);

    $response->assertNotFound()->assertJson([
        'title' => 'Not Found',
        'status' => 404,
    ]);
});

it('resends verification email for authenticated user', function (): void {
    Notification::fake();
    $user = User::factory()->unverified()->create();

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/auth/email/verification-notification');

    $response->assertStatus(202)->assertJson([
        'message' => '確認メールを再送しました。',
    ]);

    Notification::assertSentTo($user, VerifyEmail::class);
});

it('informs when verification email is already confirmed', function (): void {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/auth/email/verification-notification');

    $response->assertOk()->assertJson([
        'message' => 'メールアドレスは既に確認済みです。',
    ]);
});
