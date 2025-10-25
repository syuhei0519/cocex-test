<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('auth.register')
        ->middleware('guest:sanctum');

    Route::get('email/verify/{id}/{hash}', VerifyEmailController::class)
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['auth:sanctum', 'throttle:6,1'])
        ->name('auth.verification.send');
});
