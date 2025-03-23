<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = Room::all();
        $tasks = Task::all();

        foreach ($rooms as $room) {
            $room->tasks()->attach($tasks->random(2));
        }
    }
}
