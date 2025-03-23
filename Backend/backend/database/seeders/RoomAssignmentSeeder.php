<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomAssignment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = Room::all();
        $users = User::all();

        foreach ($rooms as $room) {
            $room->users()->attach($users->random()->id);
        }
    }
}
