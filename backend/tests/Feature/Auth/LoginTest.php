<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use function Pest\Laravel\assertGuest;
use Laravel\Sanctum\PersonalAccessToken;

uses(RefreshDatabase::class);

it('logs in a user and returns access token', function (): void {
    $password = 'passw0rd!';

    $user = User::factory()->create([
        'email' => 'john.doe@example.com',
        'password' => Hash::make($password),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'john.doe@example.com',
        'password' => $password,
    ]);

    $response->assertOk()->assertJsonStructure([
        'token',
        'user' => ['id', 'email', 'name', 'locale', 'currency', 'createdAt', 'updatedAt'],
    ])->assertJsonPath('user.id', (string) $user->id)
        ->assertJsonPath('user.email', $user->email)
        ->assertJsonPath('user.name', $user->name)
        ->assertJsonPath('user.locale', null)
        ->assertJsonPath('user.currency', null);

    expect($user->fresh()->tokens)->toHaveCount(1);
});

it('rejects invalid credentials with unauthorized response', function (): void {
    $password = 'passw0rd!';

    User::factory()->create([
        'email' => 'invalid@example.com',
        'password' => Hash::make($password),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'invalid@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(401)->assertJson([
        'title' => 'Unauthorized',
        'status' => 401,
    ]);

    assertGuest();
});

it('returns the current user when authenticated', function (): void {
    $password = 'passw0rd!';

    $user = User::factory()->create([
        'email' => 'current@example.com',
        'password' => Hash::make($password),
    ]);

    $loginResponse = $this->postJson('/api/auth/login', [
        'email' => 'current@example.com',
        'password' => $password,
    ]);

    $token = $loginResponse->json('token');
    expect($token)->toBeString()->not->toBeEmpty();

    $response = $this->getJson('/api/auth/me', [
        'Authorization' => "Bearer {$token}",
    ]);

    $response->assertOk()
        ->assertJsonPath('id', (string) $user->id)
        ->assertJsonPath('email', $user->email)
        ->assertJsonPath('name', $user->name);
});

it('requires authentication to fetch the current user', function (): void {
    $response = $this->getJson('/api/auth/me');

    $response->assertStatus(401)->assertJson([
        'message' => 'Unauthenticated.',
    ]);
});

it('logs out the user and revokes the current access token', function (): void {
    config(['sanctum.stateful' => []]);

    $password = 'passw0rd!';

    $user = User::factory()->create([
        'email' => 'logout@example.com',
        'password' => Hash::make($password),
    ]);

    $loginResponse = $this->postJson('/api/auth/login', [
        'email' => 'logout@example.com',
        'password' => $password,
    ]);

    $token = $loginResponse->json('token');

    $logoutResponse = $this->postJson('/api/auth/logout', [], [
        'Authorization' => "Bearer {$token}",
    ]);

    $logoutResponse->assertNoContent();

    expect($user->fresh()->tokens)->toHaveCount(0);

    expect(PersonalAccessToken::findToken($token))->toBeNull();
});
