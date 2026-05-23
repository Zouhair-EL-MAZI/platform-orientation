<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $verificationToken = Str::random(64);

            // Create the user with email verification pending
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => null,
                'email_verification_token' => $verificationToken,
            ]);

            $frontendUrl = env('FRONTEND_URL', config('app.url'));
            $verificationLink = rtrim($frontendUrl, '/') . '/verify-email?token=' . urlencode($verificationToken);

            Mail::send('emails.verify', [
                'name'             => $user->name,
                'verificationLink' => $verificationLink,
                'frontendUrl'      => rtrim($frontendUrl, '/'),
            ], function ($message) use ($user) {
                $message->to($user->email);
                $message->subject('Vérifiez votre adresse e-mail — Massarek');
            });

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'email' => $user->email,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'       => 'required|string|email',
            'password'    => 'required|string',
            'remember_me' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Please verify your email before logging in'
            ], 403);
        }

        // Revoke old tokens for security
        $user->tokens()->delete();

        $rememberMe = $request->boolean('remember_me', false);
        $expiresAt  = $rememberMe ? now()->addDays(30) : now()->addHours(24);

        $token = $user->createToken('massarek-api', ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'token'      => $token,
            'expires_at' => $expiresAt->toISOString(),
        ]);
    }

    /**
     * Verify email token
     */
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email_verification_token', $request->token)->first();

        if (!$user) {
            return response()->json(['message' => 'Verification token not found'], 404);
        }

        $user->email_verified_at = now();
        $user->email_verification_token = null;
        $user->save();

        return response()->json(['message' => 'Email verified successfully'], 200);
    }

    /**
     * Resend verification email
     */
    public function resendVerificationEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        $token = Str::random(64);
        $user->email_verification_token = $token;
        $user->save();

        $frontendUrl = env('FRONTEND_URL', config('app.url'));
        $verificationLink = rtrim($frontendUrl, '/') . '/verify-email?token=' . urlencode($token);

        Mail::send('emails.verify', [
            'name'             => $user->name,
            'verificationLink' => $verificationLink,
            'frontendUrl'      => rtrim($frontendUrl, '/'),
        ], function ($message) use ($user) {
            $message->to($user->email);
            $message->subject('Vérifiez votre adresse e-mail — Massarek');
        });

        return response()->json(['message' => 'Verification email sent'], 200);
    }

    /**
     * Forgot password
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'If your email exists, we have sent a password reset link.'], 200);
        }

        $token = Str::random(64);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $token, 'created_at' => now()]
        );

        $frontendUrl = env('FRONTEND_URL', config('app.url'));
        $resetLink = rtrim($frontendUrl, '/') . '/reset-password?token=' . urlencode($token);

        Mail::send('emails.reset', [
            'name'        => $user->name,
            'resetLink'   => $resetLink,
            'frontendUrl' => rtrim($frontendUrl, '/'),
        ], function ($message) use ($user) {
            $message->to($user->email);
            $message->subject('Réinitialiser votre mot de passe — Massarek');
        });

        return response()->json(['message' => 'Reset link sent to your email'], 200);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $record = DB::table('password_reset_tokens')->where('token', $request->token)->first();

        if (!$record || Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user = User::where('email', $record->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('token', $request->token)->delete();

        // Auto-login after reset
        $user->tokens()->delete();
        $token = $user->createToken('massarek-api', ['*'], now()->addHours(24))->plainTextToken;

        return response()->json([
            'message' => 'Password reset successfully',
            'user'    => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'token'   => $token,
        ], 200);
    }

    /**
     * Google login
     */
    public function googleLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->token,
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Invalid Google token'], 401);
        }

        $payload = $response->json();
        $email = $payload['email'] ?? null;
        $name = $payload['name'] ?? null;
        $googleId = $payload['sub'] ?? null;

        if (!$email || !$googleId) {
            return response()->json(['message' => 'Invalid Google token payload'], 400);
        }

        $user = User::where('email', $email)->first();

        if ($user) {
            if (!$user->google_id) {
                $user->google_id = $googleId;
            }
            if (!$user->email_verified_at) {
                $user->email_verified_at = now();
            }
            $user->save();
        } else {
            $user = User::create([
                'name' => $name ?? explode('@', $email)[0],
                'email' => $email,
                'password' => Hash::make(Str::random(16)),
                'email_verified_at' => now(),
                'google_id' => $googleId,
            ]);
        }

        $token = $user->createToken('massarek-api')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
}
