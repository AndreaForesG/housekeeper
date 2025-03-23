<?php

namespace App\Http\Controllers;

use App\Http\Requests\HotelRequest;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index()
    {
        return response()->json(Hotel::with(['rooms', 'users'])->get());
    }

    public function show($id)
    {
        $hotel = Hotel::with(['rooms', 'users'])->findOrFail($id);
        return response()->json($hotel);
    }

    public function store(HotelRequest $request)
    {
        $hotel = Hotel::create([
            'name' => $request->name,
            'location' => $request->location,
        ]);

        return response()->json($hotel, 201);
    }

    public function update(HotelRequest $request, $id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->update($request->all());

        return response()->json($hotel);
    }

    public function destroy($id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->delete();

        return response()->json(['message' => 'Hotel deleted successfully']);
    }

    public function getUsers($id)
    {
        $hotel = Hotel::findOrFail($id);
        $users = $hotel->users;
        return response()->json($users);
    }

    public function getRooms($id)
    {
        $hotel = Hotel::findOrFail($id);
        $rooms = $hotel->rooms;
        return response()->json($rooms);
    }
}
