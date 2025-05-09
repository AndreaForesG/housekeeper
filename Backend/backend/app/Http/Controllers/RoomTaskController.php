<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomTaskRequest;
use App\Models\RoomTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class RoomTaskController extends Controller
{
    public function index()
    {
        return response()->json(RoomTask::with(['room', 'task'])->get());
    }


    public function store(RoomTaskRequest $request)
    {
    RoomTask::create([
        'room_id' => $request->room_id,
        'task_id' => $request->task_id,
    ]);

    return response()->json(['message' => 'Room task assigned successfully']);
}

    public function destroy($id)
    {
        $roomTask = RoomTask::findOrFail($id);
        $roomTask->delete();

        return response()->json(['message' => 'Room task removed successfully']);
    }

    public function assignTaskToRooms(Request $request)
    {
        $request->validate([
            'room_ids' => 'required|array',
            'room_ids.*' => 'exists:rooms,id',
            'task_id' => 'required|exists:tasks,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $insertData = [];

        foreach ($request->room_ids as $roomId) {
            $insertData[] = [
                'room_id' => $roomId,
                'task_id' => $request->task_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('room_tasks')->insert($insertData);

        return response()->json(['message' => 'Tarea asignada a habitaciones correctamente']);
    }

}
