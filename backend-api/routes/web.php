<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/google/callback', [AuthController::class, 'googleCallback'])
    ->name('auth.google.callback');

Route::get('/admin/dashboard', function () {
    $frontendUrl = rtrim(env('FRONTEND_URL', config('app.url')), '/');
    return redirect()->away($frontendUrl . '/admin/dashboard');
})->name('admin.dashboard');
