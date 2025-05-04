<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function getAuthenticatedUser()
    {
        $user = Auth::user();

        $user->load('hotel');

        return response()->json([
            'user' => $user,
            'hotel' => $user->hotel_id,
        ]);
    }

    public function getUsersByHotel(Request $request)
    {
        $hotelId = $request->query('hotel_id');

        if ($hotelId) {
            $users = User::with('role')->where('hotel_id', $hotelId)->get();

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
            'plan_id'  => $validatedData['plan_id'] ?? null,
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $employee = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role_id' => 'required|integer',
            'password' => 'nullable|string|min:6',
        ]);

        $employee->name = $validated['name'];
        $employee->email = $validated['email'];
        $employee->role_id = $validated['role_id'];

        if (!empty($validated['password'])) {
            $employee->password = Hash::make($validated['password']);
        }

        $employee->save();

        return response()->json(['message' => 'Empleado actualizado con éxito']);
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
