<?php

declare(strict_types = 1);

namespace Database\Seeders;

use App\Models\TagScan;
use Illuminate\Database\Seeder;

class TagScanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TagScan::factory()->count(500)->create();
    }
}
