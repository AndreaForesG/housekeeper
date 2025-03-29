<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusRequest;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class StatusController extends Controller
{
    public function index()
    {
        $statuses = Status::with('rooms')->get();
        return response()->json($statuses);
    }

    public function show($id)
    {
        $status = Status::with('rooms')->findOrFail($id);
        return response()->json($status);
    }

   public function store(request $request)
       {
           $validator = Validator::make($request->all(), [
               'name' => 'required|string|max:20',
               'hotel_id' => 'required|exists:hotels,id',
           ]);

           if ($validator->fails()) {
               return response()->json(['errors' => $validator->errors()], 422);
           }

           $status = Status::create($request->all());
           return response()->json(['message' => 'Estado creado con éxito', 'status' => $status], 201);
       }

    public function update(StatusRequest $request, $id)
    {
        $status = Status::findOrFail($id);
        $status->update($request->validated());

        if ($request->has('rooms')) {
            $status->rooms()->sync($request->rooms);
        }

        return response()->json($status);
    }

    public function destroy($id)
    {
        $status = Status::findOrFail($id);
        $status->delete();

        return response()->json(['message' => 'Status deleted successfully']);
    }

    public function getRooms($id)
    {
        $status = Status::findOrFail($id);
        $rooms = $status->rooms;
        return response()->json($rooms);
    }

 public function getStatusByHotel($hotel_id)
    {
        $status = Status::where('hotel_id', $hotel_id)->get();

        return response()->json($status);
    }

}
