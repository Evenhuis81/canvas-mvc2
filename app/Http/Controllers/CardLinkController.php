<?php

declare(strict_types = 1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreCardLinkRequest;
use App\Models\CardLink;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CardLinkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->json([
            'activeCardLinks' => CardLink::where('end_time', '>', Carbon::now())
                ->where('is_linked', 0)->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCardLinkRequest $request)
    {
        $activeCardLink = CardLink::where('end_time', '>', Carbon::now())
            ->where('is_linked', 0)->first();
        if (!$activeCardLink) {
            $validated = $request->validated();
            $validated["end_time"] = Carbon::now()->addMinute();
            $cardLink = CardLink::create($validated);

            return response()->json([
                'activeCardLinks' => $cardLink,
            ]);
        }
        return response()->json([
            'message' => 'Er is al een koppel actie bezig probeer het over één minuut opnieuw',
        ], 400);
    }

    /**
     * Display the specified resource.
     *
     * @param CardLink $cardLink
     *
     * @return \Illuminate\Http\Response
     */
    public function show(CardLink $cardLink)
    {
        return response()->json([
            'cardLink' => $cardLink,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int                      $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
