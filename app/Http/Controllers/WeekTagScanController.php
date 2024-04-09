<?php

declare(strict_types = 1);

namespace App\Http\Controllers;

use App\Http\Resources\TagScanResource;
use App\Models\TagScan;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeekTagScanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index($date): JsonResponse
    {
        $carbonDate = Carbon::createFromFormat('Ymd', $date);
        $startDate = $carbonDate->startOfWeek()->format('Y-m-d');
        $endDate = $carbonDate->endOfWeek()->format('Y-m-d');

        $tagScans = TagScanResource::collection(
            TagScan::whereBetween('check_in_datetime', [$startDate, $endDate])->get()->sortByDesc('check_in_datetime'),
        );

        return response()->json($tagScans);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
