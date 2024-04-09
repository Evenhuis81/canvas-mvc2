<?php

declare(strict_types = 1);

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class TagScanResource extends JsonResource
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
        $checkInTime = Carbon::parse($this->check_in_datetime)->format('H:i');
        $this->check_out_datetime === null ? $checkOutTime = null
        : $checkOutTime = Carbon::parse($this->check_out_datetime)->format('H:i');

        return [
            'id' => $this->id,
            'check_in_datetime' => $this->check_in_datetime,
            'check_out_datetime' => $this->check_out_datetime,
            'check_in_time' => $checkInTime,
            'check_out_time' => $checkOutTime,
            'user_id' => $this->user_id,
            'card_number' => $this->card_number,
            'full_name' => $this->user->first_name . " " . $this->user->last_name,
        ];
    }
}
