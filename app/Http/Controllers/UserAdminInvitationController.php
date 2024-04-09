<?php

declare(strict_types = 1);

namespace App\Http\Controllers;

use App\Http\Resources\AdminInvitationResource;
use App\Mail\InviteAsAdmin;
use App\Models\AdminInvitation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserAdminInvitationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(User $user): Response
    {
        $adminInvitations = AdminInvitationResource::collection($user->adminInvitations);

        return response()->json([
            'adminInvitations' => $adminInvitations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function store(Request $request, User $user): Response
    {
        $adminInvitation = AdminInvitation::where(
            "expiration_date",
            ">",
            Carbon::now(),
        )
            ->where("invitee_user_id", $user->id)
            ->first();

        if ($adminInvitation instanceof AdminInvitation === false) {
            $adminInvitation['invitee_user_id'] = $user->id;
            $adminInvitation['inviter_user_id'] = Auth::user()->id;
            $adminInvitation['expiration_date'] = Carbon::now()->add(5, 'day');
            $adminInvitation["hash"] = Str::random(20);
            $adminInvitation = AdminInvitation::create($adminInvitation);
        }

        Mail::to($user)->send(new InviteAsAdmin($user, $adminInvitation));
        $adminInvitationResource = new AdminInvitationResource($adminInvitation);

        return response()->json([
            'adminInvitations' => $adminInvitationResource,
        ]);
    }
}
