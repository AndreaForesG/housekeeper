<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getAuthenticatedUser()
    {
        $user = Auth::user();

        $user->load('hotel');

        return response()->json([
            'user' => $user,
            'hotel' => $user->hotel_id
        ]);
    }

    public function getUsersByHotel(Request $request)
    {
        $hotelId = $request->query('hotel_id');


        if ($hotelId) {
            $users = User::where('hotel_id', $hotelId)->get();
            return response()->json($users);
        }

        return response()->json(['message' => 'Hotel ID no proporcionado'], 400);
    }



    public function index(Request $request)
    {
        $hotelId = $request->query('hotel_id');
        $users = User::where('hotel_id', $hotelId)->get();

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with(['hotel'])->findOrFail($id);
        return response()->json($user);
    }

    public function store(UserRequest $request)
    {

        $validatedData = $request->validated();

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
            'role_id' => $validatedData['role_id'],
            'hotel_id' => $validatedData['hotel_id'],
        ]);

        return response()->json($user, 201);
    }

    public function update(UserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->validated());

        if ($request->has('hotel_id')) {
            $user->hotel()->associate($request->hotel_id);
        }

        if ($request->has('roles')) {
            $user->roles()->sync($request->roles);
        }

        if ($request->has('rooms')) {
            $user->rooms()->sync($request->rooms);
        }

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function getRoles($id)
    {
        $user = User::findOrFail($id);
        $roles = $user->roles;
        return response()->json($roles);
    }

    public function getRooms($id)
    {
        $user = User::findOrFail($id);
        $rooms = $user->rooms;
        return response()->json($rooms);
    }

}
