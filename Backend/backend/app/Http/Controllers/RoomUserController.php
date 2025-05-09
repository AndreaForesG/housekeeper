<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomUserRequest;
use App\Models\RoomUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;



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


    public function assignRooms(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'room_ids' => 'required|array',
            'room_ids.*' => 'exists:rooms,id',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $assignedRooms = [];

        foreach ($request->room_ids as $room_id) {
            RoomUser::where('room_id', $room_id)
                ->where('active', true)
                ->where(function ($query) use ($request) {
                    $query->whereBetween('date_from', [$request->date_from, $request->date_to])
                        ->orWhereBetween('date_to', [$request->date_from, $request->date_to])
                        ->orWhere(function ($q) use ($request) {
                            $q->where('date_from', '<=', $request->date_from)
                                ->where('date_to', '>=', $request->date_to);
                        });
                })
                ->update(['active' => false]);

            $assignment = RoomUser::create([
                'room_id' => $room_id,
                'user_id' => $request->user_id,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'active' => true,
            ]);

            $room = DB::table('rooms')->find($room_id);
            $assignedRooms[] = [
                'room_id' => $room_id,
                'room_number' => $room->number,
                'assigned_to' => $assignment->user->name,
                'date_from' => $assignment->date_from,
                'date_to' => $assignment->date_to,
            ];
        }

        return response()->json([
            'message' => 'Habitaciones asignadas con éxito',
            'assignedRooms' => $assignedRooms,
        ]);
    }



    public function checkRoomConflicts(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'room_ids' => 'required|array',
            'room_ids.*' => 'exists:rooms,id',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $conflicts = [];

        foreach ($request->room_ids as $room_id) {
            $room_number = DB::table('rooms')->where('id', $room_id)->value('number');
            $conflict = DB::table('room_user')
                ->where('room_id', $room_id)
                ->where(function ($query) use ($request) {
                    $query->whereBetween('date_from', [$request->date_from, $request->date_to])
                        ->orWhereBetween('date_to', [$request->date_from, $request->date_to])
                        ->orWhere(function ($q) use ($request) {
                            $q->where('date_from', '<=', $request->date_from)
                                ->where('date_to', '>=', $request->date_to);
                        });
                })->exists();

            if ($conflict) {
                $conflicts[] = "La habitación $room_number ya está asignada en ese rango de fechas";
            }
        }

        if (count($conflicts) > 0) {
            return response()->json([
                'conflictExists' => true,
            ], );
        }

        return response()->json(['conflictExists' => false]);
    }


}
