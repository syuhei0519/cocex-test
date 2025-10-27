<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\CurrentUserController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\User\UpdateProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('auth.login')
        ->middleware('guest:sanctum');

    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('auth.register')
        ->middleware('guest:sanctum');

    Route::get('email/verify/{id}/{hash}', VerifyEmailController::class)
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['auth:sanctum', 'throttle:6,1'])
        ->name('auth.verification.send');

    Route::get('me', CurrentUserController::class)
        ->name('auth.me')
        ->middleware('auth:sanctum');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('auth.logout')
        ->middleware('auth:sanctum');
});

Route::patch('users/me', UpdateProfileController::class)
    ->name('users.me.update')
    ->middleware('auth:sanctum');
