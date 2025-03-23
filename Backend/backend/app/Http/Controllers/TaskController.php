<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('rooms')->get();
        return response()->json($tasks);
    }

    public function show($id)
    {
        $task = Task::with('rooms')->findOrFail($id);
        return response()->json($task);
    }

    public function store(TaskRequest $request)
    {
        $task = Task::create($request->validated());

        if ($request->has('rooms')) {
            $task->rooms()->sync($request->rooms);
        }

        return response()->json($task, 201);
    }

    public function update(TaskRequest $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update($request->validated());

        if ($request->has('rooms')) {
            $task->rooms()->sync($request->rooms);
        }

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function getRooms($id)
    {
        $task = Task::findOrFail($id);
        $rooms = $task->rooms;
        return response()->json($rooms);
    }

}
