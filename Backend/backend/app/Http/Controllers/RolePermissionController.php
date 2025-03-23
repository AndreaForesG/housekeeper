<?php

namespace App\Http\Controllers;

use App\Http\Requests\RolePermissionRequest;
use App\Models\RolePermission;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    public function index()
    {
        return response()->json(RolePermission::with(['role', 'permission'])->get());
    }

    public function store(RolePermissionRequest $request)
    {
        RolePermission::create([
            'role_id' => $request->role_id,
            'permission_id' => $request->permission_id,
        ]);

        return response()->json(['message' => 'Role permission assigned successfully']);
    }

    public function destroy($id)
    {
        $rolePermission = RolePermission::findOrFail($id);
        $rolePermission->delete();

        return response()->json(['message' => 'Role permission removed successfully']);
    }
}
