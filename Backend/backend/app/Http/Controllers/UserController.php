<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class UserController extends Controller
{

    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with(['hotel', 'roles', 'rooms'])->findOrFail($id);
        return response()->json($user);
    }

    public function store(UserRequest $request)
    {
        $user = User::create();

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
