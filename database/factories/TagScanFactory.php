<?php

declare(strict_types = 1);

namespace Database\Factories;

use App\Models\TagScan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class TagScanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TagScan::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $checkInTime = Carbon::today()->subDays(rand(0, 365));
        $checkOutTime = clone $checkInTime;

        $checkInHour = rand(9, 14);

        $checkInTime->hour = $checkInHour;
        $checkInTime->minute = rand(0, 59);
        $checkInTime->second = rand(0, 59);

        $checkOutTime->hour = rand($checkInHour, 17);
        $checkOutTime->minute = rand(0, 59);
        $checkOutTime->second = rand(0, 59);

        return [
            'user_id' => User::all()->random(),
            'check_in_datetime' => $checkInTime->format('Y-m-d H:i:s'),
            'check_out_datetime' => $checkOutTime->format('Y-m-d H:i:s'),
        ];
    }
}
