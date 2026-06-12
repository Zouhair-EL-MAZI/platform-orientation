<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * GET /api/student/profile
     * Returns the authenticated user's profile data.
     */
    public function show(Request $request)
    {
        $user    = $request->user();
        $profile = $user->profile;

        return response()->json([
            'success' => true,
            'data' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
                'role'   => $user->role,
                // Profile fields (null-safe)
                'age'              => $profile?->age,
                'education_level'  => $profile?->education_level,
                'interests'        => $profile?->interests ?? [],
                'preferred_fields' => $profile?->preferred_fields ?? [],
                'bio'              => $profile?->bio,
                'phone'            => $profile?->phone,
                'city'             => $profile?->city,
            ],
        ]);
    }

    /**
     * PUT /api/student/profile
     * Update or create profile for the authenticated user.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'             => 'sometimes|string|max:255',
            'current_password' => 'sometimes|required_with:password|string',
            'password'         => 'sometimes|string|min:8|confirmed',
            'age'              => 'sometimes|nullable|integer|min:10|max:100',
            'education_level'  => 'sometimes|nullable|string|max:255',
            'interests'        => 'sometimes|nullable|array',
            'interests.*'      => 'string|max:100',
            'preferred_fields' => 'sometimes|nullable|array',
            'preferred_fields.*' => 'string|max:100',
            'bio'              => 'sometimes|nullable|string|max:1000',
            'phone'            => 'sometimes|nullable|string|max:30',
            'city'             => 'sometimes|nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Update password if provided
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['success' => false, 'message' => 'Current password is incorrect.'], 422);
            }
            $user->password = Hash::make($request->password);
            $user->save();
        }

        // Update the user's name if provided
        if ($request->has('name') && !empty($request->name)) {
            $user->name = $request->name;
            $user->save();
        }

        // Upsert the profile
        $profileData = $request->only([
            'age', 'education_level', 'interests',
            'preferred_fields', 'bio', 'phone', 'city',
        ]);

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            array_filter($profileData, fn($v) => $v !== null)
        );

        // Return updated profile
        return $this->show($request);
    }

    /**
     * POST /api/student/profile/avatar
     * Upload and update user avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid image file',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');

        $user->avatar = $path;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Avatar updated successfully',
            'avatar'  => asset('storage/' . $path),
        ]);
    }
}
