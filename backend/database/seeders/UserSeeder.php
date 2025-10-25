<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => '田中 太郎',
            'email' => 'taro@example.com',
        ]);

        User::factory()->create([
            'name' => '山田 花子',
            'email' => 'hanako@example.com',
        ]);

        User::factory()->count(8)->create();
    }
}
