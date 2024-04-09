<?php

declare(strict_types = 1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUser;
use App\Http\Requests\UpdateUser;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $sortBy = $request->sortBy;
        $direction = $request->asc === 'true' ? 'asc' : 'desc';

        $users = User::orderBy($sortBy, $direction)->paginate(10);
        $users = UserResource::collection($users)->response()->getData(true);

        return response()->json($users);
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
     * @return JsonResponse
     */
    public function store(StoreUser $request): JsonResponse
    {
        $validated = $request->validated();
        $user = User::create($validated);

        return response()->json(new UserResource($user));
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     *
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        return response()->json(new UserResource($user));
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
     * @param User                     $user
     *
     * @return JsonResponse
     */
    public function update(UpdateUser $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        $user->update($validated);

        return response()->json(new UserResource($user));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     *
     * @return JsonResponse
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(new UserResource($user));
    }
}
