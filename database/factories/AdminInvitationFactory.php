<?php

declare(strict_types = 1);

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminInvitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $users = User::inRandomOrder()->limit(2)->get();

        return [
            'invitee_user_id' => $users[0]->id,
            'accepted' => $this->faker->boolean(),
            'hash' => Hash::make(Str::random(20)),
            'expiration_date' => Carbon::today()->subDays(rand(0, 180)),
            'inviter_user_id' => $users[1]->id,
        ];
    }
}
