<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->call([
            HotelSeeder::class,
            RoleSeeder::class,
            PermissionSeeder::class,
            UserSeeder::class,
            UserRoleSeeder::class,
            RolePermissionSeeder::class,
            RoomSeeder::class,
            TaskSeeder::class,
            RoomTaskSeeder::class,
            RoomAssignmentSeeder::class,
            StatusSeeder::class,
            RoomStatusSeeder::class,
        ]);
    }
}
