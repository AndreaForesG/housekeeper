<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomUserRequest;
use App\Models\RoomUser;
use Illuminate\Http\Request;

class RoomUserController extends Controller
{
    public function index()
    {
        return response()->json(RoomUser::with(['room', 'user'])->get());
    }

    public function store(RoomUserRequest $request)
    {
        RoomUser::create([
            'room_id' => $request->room_id,
            'user_id' => $request->user_id,
        ]);

        return response()->json(['message' => 'Employee assigned to room successfully']);
    }

    public function destroy($id)
    {
        $roomUser = RoomUser::findOrFail($id);
        $roomUser->delete();

        return response()->json(['message' => 'Employee removed from room successfully']);
    }
}
