<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function show($id)
    {
        $role = Role::with(['users', 'permissions'])->findOrFail($id);
        return response()->json($role);
    }

    public function store(RoleRequest $request)
    {
        $role = Role::create($request->validated());

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json($role, 201);
    }

    public function update(RoleRequest $request, $id)
    {
        $role = Role::findOrFail($id);

        $role->update($request->validated());

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }

    public function getPermissions($id)
    {
        $role = Role::findOrFail($id);
        $permissions = $role->permissions;
        return response()->json($permissions);
    }

    public function getUsers($id)
    {
        $role = Role::findOrFail($id);
        $users = $role->users;
        return response()->json($users);
    }

}
