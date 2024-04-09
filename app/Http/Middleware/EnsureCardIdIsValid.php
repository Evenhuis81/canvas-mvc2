<?php

declare(strict_types = 1);

namespace App\Http\Middleware;

use App\Models\Card;
use App\Models\CardLink;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;

class EnsureCardIdIsValid
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
        $cardNumber = $request->route('card');

        // check if card id exists in database. If not, redirect to CardLinkController
        // to check if there is an active card / user link session

        if (Card::where("card_number", $cardNumber)->count() === 0) {
            $activeCardLink = CardLink::where("end_time", ">", Carbon::now())
                ->where('is_linked', 0)->first();

            if ($activeCardLink instanceof CardLink) {
                $newCard = Card::create(['card_number' => $cardNumber]);
                $newCard->user()->associate($activeCardLink->user);
                $newCard->save();

                $activeCardLink->update(['is_linked' => true, 'card_number' => $cardNumber]);

                return response()->json([
                    'newcard' => $newCard,
                ]);
            }

            return response()->json([
                'message' => 'card_id doesnt exist',
            ], 400);
        }

        return $next($request);
    }
}
