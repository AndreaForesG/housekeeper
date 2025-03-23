<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = Room::all();
        $statuses = Status::all();

        foreach ($rooms as $room) {
            $status = $statuses->random();

            DB::table('room_statuses')->insert([
                'room_id' => $room->id,
                'status_id' => $status->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
