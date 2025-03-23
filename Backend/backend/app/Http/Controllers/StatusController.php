<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusRequest;
use App\Models\Status;
use Illuminate\Http\Request;

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

    public function store(StatusRequest $request)
    {
        $status = Status::create($request->validated());

        if ($request->has('rooms')) {
            $status->rooms()->sync($request->rooms);
        }

        return response()->json($status, 201);
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

}
