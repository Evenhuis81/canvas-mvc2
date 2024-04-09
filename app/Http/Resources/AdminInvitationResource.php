<?php

declare(strict_types = 1);

namespace App\Http\Resources;

use App\Http\Resources\UserResource;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class AdminInvitationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array|JsonSerializable
     */
    public function toArray($request): array|JsonSerializable
    {
        $now = Carbon::now();

        if ($now->greaterThan($this->expiration_date)) {
            $expired = true;
        } else {
            $expired = false;
        }

        return [
            'id' => $this->id,
            'expiration_date' => $this->expiration_date,
            'expired' => $expired,
            'hash' => $this->hash,
            'invitee_user_id' => $this->invitee_user_id,
            'inviter_user_id' => $this->inviter_user_id,
            'invited_user' => new UserResource($this->user),
            'accepted' => $this->accepted,
        ];
    }
}
