<?php

declare(strict_types = 1);

namespace Database\Seeders;

use App\Models\AdminInvitation;
use Illuminate\Database\Seeder;

class AdminInvitationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        AdminInvitation::factory()->count(200)->create();
    }
}
