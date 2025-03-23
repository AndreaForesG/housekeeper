<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with(['hotel', 'tasks', 'users'])->get();
        return response()->json($rooms);
    }

    public function show($id)
    {
        $room = Room::with(['hotel', 'tasks', 'users'])->findOrFail($id);
        return response()->json($room);
    }

    public function store(RoomRequest $request)
    {
        $room = Room::create($request->validated());

        if ($request->has('tasks')) {
            $room->tasks()->sync($request->tasks);
        }

        if ($request->has('users')) {
            $room->users()->sync($request->users);
        }

        return response()->json($room, 201);
    }

    public function update(RoomRequest $request, $id)
    {
        $room = Room::findOrFail($id);
        $room->update($request->validated());

        if ($request->has('tasks')) {
            $room->tasks()->sync($request->tasks);
        }

        if ($request->has('users')) {
            $room->users()->sync($request->users);
        }

        return response()->json($room);
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }

    public function getTasks($id)
    {
        $room = Room::findOrFail($id);
        $tasks = $room->tasks;
        return response()->json($tasks);
    }

    public function getUsers($id)
    {
        $room = Room::findOrFail($id);
        $users = $room->users;
        return response()->json($users);
    }

    public function getStatuses($id)
    {
        $room = Room::findOrFail($id);
        $statuses = $room->statuses;
        return response()->json($statuses);
    }

}
