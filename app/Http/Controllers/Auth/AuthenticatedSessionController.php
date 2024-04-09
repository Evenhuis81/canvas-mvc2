<?php

declare(strict_types = 1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Check if user is authenticated and return user info.
     *
     * @return JsonResponse
     */
    public function me(): JsonResponse
    {
        if (Auth::check()) {
            return $this->user();
        }

        return response()->json(['message' => ['user not authenticated']], 401);
    }

    /**
     * Return the loggedin user.
     *
     * @return JsonResponse
     */
    public function user(): JsonResponse
    {
        return response()->json(new UserResource(auth()->user()));
    }

    /**
     * Handle an incoming authentication request.
     *
     * @param \App\Http\Requests\Auth\LoginRequest $request
     *
     * @return JsonResponse
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        return response()->json(new UserResource($user));
    }

    /**
     * Destroy an authenticated session.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['message' => 'User successfully signed out']);
    }
}
