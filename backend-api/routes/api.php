<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Public routes ──────────────────────────────────────────────────────────
Route::post('/contact/send', [ContactController::class, 'send']);

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/resend-verification-email', [AuthController::class, 'resendVerificationEmail'])->middleware('throttle:3,60');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:3,60');
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/auth/google', [AuthController::class, 'googleLogin']);

// ── Protected routes ───────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth utilities
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // ── Student routes (all authenticated users — students) ────────────────
    Route::prefix('student')->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Orientation Tests
        Route::get('/tests', [TestController::class, 'index']);
        Route::get('/tests/{id}', [TestController::class, 'show']);
        Route::post('/tests/{id}/submit', [TestController::class, 'submit']);
        Route::get('/tests/{id}/results', [TestController::class, 'results']);

        // AI Recommendations (rate-limited to 3 calls per hour)
        Route::get('/recommendations', [RecommendationController::class, 'index']);
        Route::post('/recommendations/generate', [RecommendationController::class, 'generate'])
            ->middleware('throttle:15,60');

        // Career Explorer
        Route::get('/careers', [CareerController::class, 'index']);
        Route::get('/careers/{id}', [CareerController::class, 'show']);
        Route::get('/career-categories', [CareerController::class, 'categories']);

        // AI Chatbot (rate-limited to 30 messages per minute)
        Route::post('/chat', [ChatController::class, 'message']);

        // Profile
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    });

    // ── Admin routes (admin role only) ─────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/ping', fn() => response()->json(['message' => 'ok']));
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/tests', [AdminController::class, 'tests']);
        Route::put('/tests/{id}/status', [AdminController::class, 'updateTestStatus']);
        Route::get('/recommendations', [AdminController::class, 'recommendations']);
        Route::get('/careers', [CareerController::class, 'index']);
        Route::get('/career-categories', [CareerController::class, 'categories']);
    });
});
