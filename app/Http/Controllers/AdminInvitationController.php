<?php

declare(strict_types = 1);

namespace App\Http\Controllers;

use App\Http\Requests\RegisterAdmin;
use App\Http\Resources\AdminInvitationResource;
use App\Mail\Confirmation;
use App\Models\AdminInvitation;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AdminInvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $adminInvitations = AdminInvitationResource::collection(
            AdminInvitation::all(),
        );

        return response()->json([
            'adminInvitations' => $adminInvitations,
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param AdminInvitation $hash
     *
     * @return \Illuminate\Http\Response
     */
    public function show(AdminInvitation $hash)
    {
        $adminInvitation = new AdminInvitationResource($hash);
        return response()->json([
            'adminInvitation' => $adminInvitation,
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
     * @param AdminInvitation          $hash
     *
     * @return \Illuminate\Http\Response
     */
    public function update(RegisterAdmin $request, AdminInvitation $hash)
    {
        $user = $hash->user;
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $user->update($validated);
        $user->roles()->attach(Role::where('name', 'Admin')->get());
        $hash->update(['accepted' => true]);
        Auth::login($user);
        Mail::to($user)->send(new Confirmation($user));

        return response()->json([
            'user' => $user,
        ]);
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
