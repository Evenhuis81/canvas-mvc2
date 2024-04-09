<?php

declare(strict_types = 1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('cards')->insert([
            'user_id' => User::where('email', 'admin@script.nl')->first()->id,
            'card_number' => "111111111",
        ]);

        DB::table('cards')->insert([
            'user_id' => User::where('email', 'jeroen@script.nl')->first()->id,
            'card_number' => "428255304",
        ]);

        DB::table('cards')->insert([
            'user_id' => User::where('email', 'hans@script.nl')->first()->id,
            'card_number' => "222222222",
        ]);
    }
}
