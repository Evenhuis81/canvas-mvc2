<?php

declare(strict_types = 1);

namespace App\Http\Controllers;

use App\Http\Requests\TagScanRequest;
use App\Http\Resources\TagScanResource;
use App\Models\Card;
use App\Models\TagScan;
use Carbon\Carbon;

class CardTagScanController extends Controller
{
    /**
     * Store a TagScan check-in / check-out in storage.
     *
     * @param \Illuminate\Http\TagScanRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(TagScanRequest $request, Card $card)
    {
        // check if card has 1 check-in for today
        $tagScans = $card->user->tagScans->filter(function ($tagScan, $key) {
            return Carbon::createFromDate($tagScan->check_in_datetime)->isSameDay(Carbon::now()) === true
                && $tagScan->check_out_datetime === null;
        });
        // check-out card
        if ($tagScans->count() > 0) {
            $tagScan = $tagScans->first();
            $timestamp['check_out_datetime'] = Carbon::now()->toDateTimeString();
            $tagScan->update($timestamp);
        // check-in card
        } else {
            $validated = $request->validated();
            $validated['check_in_datetime'] = Carbon::now()->toDateTimeString();
            $validated['card_id'] = $card->id;

            $userId = $card->user->id;
            $validated['user_id'] = $userId;
            $tagScan = TagScan::create($validated);
        }
        $tagScan = new TagScanResource($tagScan);

        return response()->json([
            'tag_scan' => $tagScan,
        ]);
    }
}
