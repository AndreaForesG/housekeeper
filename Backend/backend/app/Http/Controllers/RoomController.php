<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Models\Room;
use App\Models\RoomUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use function PHPUnit\Framework\assertEqualsIgnoringCase;


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
        $validator = Validator::make($request->all(), [
            'number' => 'required|string|max:20',
            'floor' => 'required|integer',
            'hotel_id' => 'required|exists:hotels,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exists = Room::where('number', $request->number)
            ->where('floor', $request->floor)
            ->where('hotel_id', $request->hotel_id)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Esta habitación ya existe en esta planta'], 409);
        }

        $room = Room::create($request->all());
        return response()->json(['message' => 'Habitación creada con éxito', 'room' => $room], 201);
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

public function importRooms(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:csv,txt'
    ]);

    $file = $request->file('file');
    $csvData = array_map('str_getcsv', file($file));

    DB::beginTransaction();

    try {
        foreach ($csvData as $index => $row) {
            if ($index === 0) continue;

            $exists = Room::where('number', $row[1])
                          ->where('floor', $row[0])
                          ->where('hotel_id', $request->hotel_id)
                          ->exists();

            if ($exists) {
              return response()->json(['error' => 'Habitaciones repetidas']);
;
            }

            Room::create([
                'number' => $row[1],
                'floor' => $row[0],
                'hotel_id' => $request->hotel_id
            ]);
        }

        DB::commit();

        return response()->json(['message' => 'Habitaciones importadas correctamente']);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Hubo un error al importar las habitaciones.'], 500);
    }
}

    public function getRoomsByHotel($hotel_id)
    {
        $rooms = Room::where('hotel_id', $hotel_id)->get();

        if ($rooms->isEmpty()) {
            return response()->json(['message' => 'No hay habitaciones para este hotel'], 404);
        }

        $rooms = $rooms->map(function ($room) {
            $currentAssignment = $room->hasOne(RoomUser::class)
                ->where('active', true)
                ->whereDate('date_from', '<=', now()->toDateString())
                ->whereDate('date_to', '>=', now()->toDateString())
                ->first();

            $assigned_to = $currentAssignment ? $currentAssignment->user?->name : 'Sin asignar';

            $roomStatus = $room->roomStatuses()
                ->whereDate('date', '=', now()->toDateString())
                ->latest()
                ->first();

            $status_name = $roomStatus ? $roomStatus->status->name : 'Sin estado';
            $status_color = $roomStatus ? $roomStatus->status->color : '#FFFFFF';

            return [
                'id' => $room->id,
                'number' => $room->number,
                'floor' => $room->floor,
                'assigned_to' => $assigned_to,
                'status' => $status_name,
                'status_color' => $status_color,
            ];
        });

        return response()->json($rooms);
    }






}
