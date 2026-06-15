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
use App\Models\PendingRegistration;

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
            // Check if email already in pending_registrations
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette adresse e-mail est déjà utilisée.',
                    'errors'  => ['email' => ['Cette adresse e-mail est déjà utilisée.']]
                ], 422);
            }
            $verificationToken = Str::random(64);

            // Store in pending_registrations until email is verified
            PendingRegistration::updateOrCreate(
                ['email' => $request->email],
                [
                    'name'       => $request->name,
                    'password'   => Hash::make($request->password),
                    'token'      => $verificationToken,
                    'expires_at' => now()->addHours(24),
                ]
            );

            $frontendUrl = env('FRONTEND_URL', config('app.url'));
            $verificationLink = rtrim($frontendUrl, '/') . '/verify-email?token=' . urlencode($verificationToken);

            Mail::send('emails.verify', [
                'name'             => $request->name,
                'verificationLink' => $verificationLink,
                'frontendUrl'      => rtrim($frontendUrl, '/'),
            ], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Vérifiez votre adresse e-mail — Massarek');
            });

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'email'   => $request->email,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error'   => $e->getMessage()
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

        if (strtolower($user->status) === 'inactive') {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte est inactif. Veuillez contacter l\'administrateur.'
            ], 403);
        }

        // Revoke old tokens for security
        $user->tokens()->delete();

        $rememberMe = $request->boolean('remember_me', false);
        $expiresAt  = $rememberMe ? now()->addDays(30) : now()->addHours(24);

        $token = $user->createToken('massarek-api')->plainTextToken;

        // Determine redirect path based on role
        $role = $user->role ?? 'student';
        $redirectPath = $role === 'admin' ? '/admin/dashboard' : '/dashboard';

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $role,
            ],
            'token'      => $token,
            'expires_at' => $expiresAt->toISOString(),
            'role'       => $role,
            'redirect'   => $redirectPath,
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

        $pending = PendingRegistration::where('token', $request->token)->first();

        if (!$pending) {
            return response()->json(['message' => 'Verification token not found'], 404);
        }

        if (Carbon::parse($pending->expires_at)->isPast()) {
            $pending->delete();
            return response()->json(['message' => 'Verification link has expired'], 410);
        }

        // Create the real user now
        User::create([
            'name'              => $pending->name,
            'email'             => $pending->email,
            'password'          => $pending->password,
            'email_verified_at' => now(),
        ]);

        $pending->delete();

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

        // Check if already a verified user
        if (User::where('email', $request->email)->whereNotNull('email_verified_at')->exists()) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        $pending = PendingRegistration::where('email', $request->email)->first();

        if (!$pending) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $token = Str::random(64);
        $pending->token      = $token;
        $pending->expires_at = now()->addHours(24);
        $pending->save();

        $frontendUrl = env('FRONTEND_URL', config('app.url'));
        $verificationLink = rtrim($frontendUrl, '/') . '/verify-email?token=' . urlencode($token);

        Mail::send('emails.verify', [
            'name'             => $pending->name,
            'verificationLink' => $verificationLink,
            'frontendUrl'      => rtrim($frontendUrl, '/'),
        ], function ($message) use ($pending) {
            $message->to($pending->email);
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
            'name'  => 'nullable|string|max:255',
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
        $email = isset($payload['email']) ? strtolower(trim($payload['email'])) : null;
        $name = $request->input('name') ?? $payload['name'] ?? $payload['given_name'] ?? explode('@', $email)[0];
        $googleId = $payload['sub'] ?? null;

        if (!$email || !$googleId) {
            return response()->json(['message' => 'Invalid Google token payload'], 400);
        }

        // Case-insensitive lookup to match existing users regardless of email casing
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if ($user && strtolower($user->status) === 'inactive') {
            return response()->json([
                'success' => false,
                'message' => 'Votre compte est inactif. Veuillez contacter l\'administrateur.'
            ], 403);
        }

        if (!$user) {
            // Auto-create account for new Google users
            $user = User::create([
                'name'              => $name,
                'email'             => $email,
                'password'          => Hash::make(Str::random(32)),
                'google_id'         => $googleId,
                'email_verified_at' => now(),
                'role'              => 'student',
            ]);
        } else {
            // Link Google account if needed and ensure email is verified.
            if (!$user->google_id) {
                $user->google_id = $googleId;
            }
            if (!$user->email_verified_at) {
                $user->email_verified_at = now();
            }
            $user->save();
        }

        Auth::login($user);

        // Revoke previous tokens for security.
        $user->tokens()->delete();

        $token     = $user->createToken('massarek-api')->plainTextToken;
        $expiresAt = now()->addHours(24);

        $role         = $user->role ?? 'student';
        $redirectPath = $role === 'admin' ? '/admin/dashboard' : '/dashboard';

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $role,
            ],
            'token'      => $token,
            'expires_at' => $expiresAt->toISOString(),
            'role'       => $role,
            'redirect'   => $redirectPath,
        ]);
    }

    /**
     * Google callback for web-based admin login.
     */
    public function googleCallback(Request $request)
    {
        $idToken = $request->query('id_token') ?? $request->query('token');

        if (!$idToken) {
            return redirect()->away(rtrim(env('FRONTEND_URL', config('app.url')), '/') . '/login')
                ->with('error', 'Missing Google ID token.');
        }

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $idToken,
        ]);

        if (!$response->successful()) {
            return redirect()->away(rtrim(env('FRONTEND_URL', config('app.url')), '/') . '/login')
                ->with('error', 'Invalid Google token.');
        }

        $payload = $response->json();
        $email = isset($payload['email']) ? strtolower(trim($payload['email'])) : null;
        $googleId = $payload['sub'] ?? null;

        if (!$email || !$googleId) {
            return redirect()->away(rtrim(env('FRONTEND_URL', config('app.url')), '/') . '/login')
                ->with('error', 'Invalid Google token payload.');
        }

        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if ($user && strtolower($user->status) === 'inactive') {
            return redirect()->away(rtrim(env('FRONTEND_URL', config('app.url')), '/') . '/login?error=inactive');
        }

        if (!$user || ($user->role ?? 'student') !== 'admin') {
            return redirect()->away(rtrim(env('FRONTEND_URL', config('app.url')), '/') . '/login')
                ->with('error', 'Google login is restricted to admin users.');
        }

        if (!$user->google_id) {
            $user->google_id = $googleId;
        }
        if (!$user->email_verified_at) {
            $user->email_verified_at = now();
        }
        $user->save();

        Auth::login($user);

        return redirect()->route('admin.dashboard');
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
