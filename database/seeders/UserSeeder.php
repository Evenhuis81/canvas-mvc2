<?php

declare(strict_types = 1);

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $adminRole = Role::where('name', 'Admin')->get();
        $deelnemerRole = Role::where('name', 'Deelnemer')->get();

        $user = User::create([
            'first_name' => 'admin',
            'last_name' => 'script',
            'email' => 'admin@script.nl',
            'password' => Hash::make('admin'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);

        $user->roles()->attach($adminRole);

        $user = User::create([
            'first_name' => 'Jeroen',
            'last_name' => 'Postema',
            'email' => 'jeroen@script.nl',
            'password' => Hash::make('postema'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);

        $user->roles()->attach($adminRole);

        $user = User::create([
            'first_name' => 'Hans',
            'last_name' => 'Test',
            'email' => 'hans@script.nl',
            'password' => Hash::make('hans'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);

        $user->roles()->attach($adminRole);

        User::factory()->count(200)->hasAttached($deelnemerRole)->create();
    }
}
