<?php

declare(strict_types = 1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class RoleResource extends JsonResource
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
        return [
            'name' => $this->name,
            'id' => $this->id,
        ];
    }
}
