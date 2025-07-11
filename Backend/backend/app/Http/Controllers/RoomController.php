<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Models\Room;
use App\Models\RoomUser;
use Carbon\Carbon;
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
            return response()->json(['error' => 'La habitación ya existe en la planta.'], 409);
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

    public function getRoomsByHotel($hotel_id, $date = null)
    {
        $date = $date ? Carbon::parse($date)->toDateString() : now()->toDateString();

        $rooms = Room::where('hotel_id', $hotel_id)->get();

        $rooms = $rooms->map(function ($room) use ($date) {
            $currentAssignment = $room->hasOne(RoomUser::class)
                ->where('active', true)
                ->whereDate('date_from', '<=', $date)
                ->whereDate('date_to', '>=', $date)
                ->first();

            $assigned_to = $currentAssignment ? $currentAssignment->user?->name : 'Sin asignar';
            $user_id = $currentAssignment ? $currentAssignment->user?->id : 'Sin asignar';

            $roomStatus = $room->roomStatuses()
                ->whereDate('date', '=', $date)
                ->latest()
                ->first();

            $status_name = $roomStatus ? $roomStatus->status->name : 'Sin estado';
            $status_color = $roomStatus ? $roomStatus->status->color : '#FFFFFF';

            $tasks = $room->roomTasks()
                ->whereDate('start_date', '<=', $date)
                ->whereDate('end_date', '>=', $date)
                ->with(['task', 'logs' => function ($q) {
                    $q->latest();
                }])
                ->get()
                ->map(function ($roomTask) {
                    $log = $roomTask->logs->first();

                    return [
                        'room_task_id' => $roomTask->id,
                        'task_id' => $roomTask->task->id,
                        'task_name' => $roomTask->task->name,
                        'task_color' => $roomTask->task->color,
                        'start_date' => $roomTask->start_date,
                        'end_date' => $roomTask->end_date,
                        'log' => $log ? [
                            'is_done' => $log->is_done,
                            'observation' => $log->observation
                        ] : [
                            'is_done' => false,
                            'observation' => 'No hay observaciones'
                        ],
                    ];
                });

            return [
                'id' => $room->id,
                'number' => $room->number,
                'floor' => $room->floor,
                'assigned_to' => $assigned_to,
                'user_id' => $user_id,
                'status' => $status_name,
                'status_color' => $status_color,
                'tasks' => $tasks->values(),
            ];
        });

        return response()->json($rooms);
    }






}
