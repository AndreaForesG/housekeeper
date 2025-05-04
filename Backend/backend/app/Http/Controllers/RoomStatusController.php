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
        // Validaciones
        $request->validate([
            'status' => 'required|exists:statuses,id',  // Asegúrate de que el estado es válido
            'date' => 'required|date',  // La fecha de trabajo
            'rooms' => 'required|array',  // Asegúrate de que se seleccionan habitaciones
            'rooms.*' => 'exists:rooms,id',  // Las habitaciones deben ser válidas
        ]);

        // Obtener el estado y la fecha del cuerpo de la solicitud
        $status = $request->status;
        $date = $request->date;

        // Iterar sobre las habitaciones seleccionadas y registrar el cambio de estado
        foreach ($request->rooms as $roomId) {
            RoomStatus::create([
                'room_id' => $roomId,
                'status_id' => $status,  // El ID del estado
                'date' => $date,  // La fecha de trabajo
            ]);
        }

        // Responder con éxito
        return response()->json(['message' => 'Estados de habitaciones cambiados con éxito.']);
    }
}
