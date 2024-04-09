<?php

declare(strict_types = 1);

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;

class EnsureHashIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $adminInvitation = $request->route('hash');

        if (Carbon::parse($adminInvitation->expiration_date)->isFuture() && !$adminInvitation->accepted) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Invitation not found',
        ], 400);
    }
}
