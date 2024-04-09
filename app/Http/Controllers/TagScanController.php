<?php

declare(strict_types = 1);

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTagScanRequest;
use App\Http\Resources\TagScanResource;
use App\Models\TagScan;
use Illuminate\Http\Response;

class TagScanController extends Controller
{
    /**
     * Display a listing of all TagScan check-ins / check-outs
     *
     * @return Response
     */
    public function index(): Response
    {
        return response()->json(TagScan::all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param TagScan                  $tagScan
     *
     * @return Response
     */
    public function update(UpdateTagScanRequest $request, TagScan $tagScan): Response
    {
        $validated = $request->validated();

        $date = substr($tagScan->check_in_datetime, 0, 10);

        $validated['check_in_datetime'] = $date . " " . $validated['check_in_time'];
        $validated['check_out_datetime'] = $date . " " . $validated['check_out_time'];

        $tagScan->update($validated);

        return response()->json(new TagScanResource($tagScan));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param TagScan $tagScan
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(TagScan $tagScan)
    {
        $tagScan->delete();

        return response()->json(new TagScanResource($tagScan));
    }
}
