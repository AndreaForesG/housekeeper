<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionRequest;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::with('roles')->get();
        return response()->json($permissions);
    }

    public function show($id)
    {
        $permission = Permission::with('roles')->findOrFail($id);
        return response()->json($permission);
    }

    public function store(PermissionRequest $request)
    {
        $permission = Permission::create($request->validated());

        return response()->json($permission, 201);
    }

    public function update(PermissionRequest $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $permission->update($request->validated());

        return response()->json($permission);
    }

    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['message' => 'Permission deleted successfully']);
    }

    public function getRoles($id)
    {
        $permission = Permission::findOrFail($id);
        $roles = $permission->roles;
        return response()->json($roles);
    }

}
