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

    $verificationUrl = createVerificationUrl($user);

    $response = $this->getJson(verificationPath($verificationUrl));

    $response->assertOk()->assertJson([
        'message' => 'メールアドレスを確認しました。',
    ]);

    Event::assertDispatched(Verified::class);
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

it('returns message when email is already verified', function (): void {
    $user = User::factory()->create();

    $verificationUrl = createVerificationUrl($user);

    $response = $this->getJson(verificationPath($verificationUrl));

    $response->assertOk()->assertJson([
        'message' => 'メールアドレスは既に確認済みです。',
    ]);
});

it('rejects verification links with invalid signatures', function (): void {
    $user = User::factory()->unverified()->create();

    $invalidUrl = createVerificationUrl($user, expiresAt: now()->subMinute());

    $response = $this->getJson(verificationPath($invalidUrl));

    $response->assertStatus(400)->assertJson([
        'title' => 'Bad Request',
        'status' => 400,
    ]);
});

it('returns not found when user does not exist', function (): void {
    $user = User::factory()->unverified()->create();

    $verificationUrl = createVerificationUrl($user, additionalParameters: ['id' => $user->id + 1]);

    $response = $this->getJson(verificationPath($verificationUrl));

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

it('verifies user via notification link end-to-end', function (): void {
    Notification::fake();

    $payload = [
        'name' => '通知経由ユーザー',
        'email' => 'notify-flow@example.com',
        'password' => 'passw0rd!',
    ];

    $response = $this->postJson('/api/auth/register', $payload);

    $response->assertCreated()->assertJson([
        'requiresEmailVerification' => true,
    ]);

    $user = User::query()->firstWhere('email', $payload['email']);
    expect($user)->not->toBeNull();
    expect($user?->hasVerifiedEmail())->toBeFalse();

    $verificationUrl = null;
    Notification::assertSentTo(
        $user,
        VerifyEmail::class,
        function (VerifyEmail $notification) use (&$verificationUrl, $user) {
            $verificationUrl = $notification->toMail($user)->actionUrl;

            return true;
        }
    );

    $verificationResponse = $this->getJson(verificationPath($verificationUrl));
    $verificationResponse->assertOk()->assertJson([
        'message' => 'メールアドレスを確認しました。',
    ]);

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();

    $revisitResponse = $this->getJson(verificationPath($verificationUrl));
    $revisitResponse->assertOk()->assertJson([
        'message' => 'メールアドレスは既に確認済みです。',
    ]);
});

function createVerificationUrl(User $user, ?\DateTimeInterface $expiresAt = null, array $additionalParameters = []): string
{
    return URL::temporarySignedRoute(
        'verification.verify',
        $expiresAt ?? now()->addMinutes(60),
        array_merge([
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification()),
        ], $additionalParameters)
    );
}

function verificationPath(string $signedUrl): string
{
    $parts = parse_url($signedUrl);

    $path = $parts['path'] ?? '';
    $query = isset($parts['query']) ? '?'.$parts['query'] : '';

    return $path.$query;
}
