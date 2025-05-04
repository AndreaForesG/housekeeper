<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomStatusRequest;
use App\Models\RoomStatus;
use Illuminate\Http\Request;

class RoomStatusController extends Controller
{
    public function index()
    {
        return response()->json(RoomStatus::with(['room', 'status'])->get());
    }

    public function store(RoomStatusRequest $request)
    {
        RoomStatus::create([
            'room_id' => $request->room_id,
            'status_id' => $request->status_id,
        ]);

        return response()->json(['message' => 'Room status assigned successfully']);
    }

    public function destroy($id)
    {
        $roomStatus = RoomStatus::findOrFail($id);
        $roomStatus->delete();

        return response()->json(['message' => 'Room status removed successfully']);
    }

    public function changeRoomStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|exists:statuses,id',
            'date' => 'required|date',
            'rooms' => 'required|array',
            'rooms.*' => 'exists:rooms,id',
        ]);

        $status = $request->status;
        $date = $request->date;

        foreach ($request->rooms as $roomId) {
            RoomStatus::create([
                'room_id' => $roomId,
                'status_id' => $status,
                'date' => $date,
            ]);
        }

        return response()->json(['message' => 'Estados de habitaciones cambiados con éxito.']);
    }
}
