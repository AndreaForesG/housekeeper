<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomTaskRequest;
use App\Models\RoomTask;
use Illuminate\Http\Request;

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
}
