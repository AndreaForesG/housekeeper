<?php

namespace App\Http\Controllers;

use App\Models\RoomTaskLog;
use Illuminate\Http\Request;

class RoomTaskLogController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'room_task_id' => 'required|exists:room_tasks,id',
            'user_id' => 'required|exists:users,id',
            'is_done' => 'required|boolean',
            'observation' => 'nullable|string',
            'completed_at' => 'required|date',
        ]);


        $roomTaskLog = RoomTaskLog::create([
            'room_task_id' => $validatedData['room_task_id'],
            'user_id' => $validatedData['user_id'],
            'is_done' => $validatedData['is_done'],
            'observation' => $validatedData['observation'],
            'completed_at' => $validatedData['completed_at'],
        ]);

        return response()->json($roomTaskLog, 201); // O cualquier respuesta apropiada
    }

    public function getLogs($hotelId)
    {
        $logs = RoomTaskLog::join('room_tasks', 'room_task_logs.room_task_id', '=', 'room_tasks.id')
            ->join('rooms', 'room_tasks.room_id', '=', 'rooms.id')
            ->join('users', 'room_task_logs.user_id', '=', 'users.id')  // Unir con la tabla de usuarios
            ->join('tasks', 'room_tasks.task_id', '=', 'tasks.id') // Unir con la tabla de tasks
            ->where('rooms.hotel_id', $hotelId)  // Filtrar por el hotel
            ->select('room_task_logs.*', 'users.name as user_name', 'tasks.name as task_name') // Seleccionar los datos y el nombre de la tarea
            ->get();

        // Retornar los logs como respuesta JSON
        return response()->json($logs);
    }

}
