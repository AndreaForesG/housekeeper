<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomStatusController;
use App\Http\Controllers\RoomTaskController;
use App\Http\Controllers\RoomTaskLogController;
use App\Http\Controllers\RoomUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\PlanController;;
use App\Http\Controllers\PaymentController;

// Obtener todos los hoteles
Route::get('hotels', [HotelController::class, 'index']);

// Obtener un hotel específico
Route::get('hotels/{hotel}', [HotelController::class, 'show']);

// Crear un nuevo hotel
Route::post('hotels', [HotelController::class, 'store']);

// Actualizar un hotel específico
Route::put('hotels/{hotel}', [HotelController::class, 'update']);

// Eliminar un hotel específico
Route::delete('hotels/{hotel}', [HotelController::class, 'destroy']);

// Relaciones de hoteles
Route::get('hotels/{hotel}/users', [HotelController::class, 'getUsers']);
Route::get('hotels/{hotel}/rooms', [HotelController::class, 'getRooms']);



// Obtener todos los usuarios
Route::get('users', [UserController::class, 'index']);

// Obtener un usuario específico
Route::get('users/{user}', [UserController::class, 'show']);

// Crear un nuevo usuario
Route::post('users', [UserController::class, 'store']);

// Actualizar un usuario específico
Route::put('users/{user}', [UserController::class, 'update']);

// Eliminar un usuario específico
Route::delete('users/{user}', [UserController::class, 'destroy']);

// Relaciones de usuarios
Route::get('users/{user}/roles', [UserController::class, 'getRoles']); // Obtener roles de un usuario
Route::get('users/{user}/rooms', [UserController::class, 'getRooms']); // Obtener habitaciones de un usuario

// Obtener todos los roles
Route::get('roles', [RoleController::class, 'index']);

// Obtener un rol específico
Route::get('roles/{role}', [RoleController::class, 'show']);

// Crear un nuevo rol
Route::post('roles', [RoleController::class, 'store']);

// Actualizar un rol específico
Route::put('roles/{role}', [RoleController::class, 'update']);

// Eliminar un rol específico
Route::delete('roles/{role}', [RoleController::class, 'destroy']);

// Relaciones de roles
Route::get('roles/{role}/permissions', [RoleController::class, 'getPermissions']); // Obtener permisos de un rol
Route::get('roles/{role}/users', [RoleController::class, 'getUsers']); // Obtener usuarios con ese rol


// Obtener todos los permisos
Route::get('permissions', [PermissionController::class, 'index']);

// Obtener un permiso específico
Route::get('permissions/{permission}', [PermissionController::class, 'show']);

// Crear un nuevo permiso
Route::post('permissions', [PermissionController::class, 'store']);

// Actualizar un permiso específico
Route::put('permissions/{permission}', [PermissionController::class, 'update']);

// Eliminar un permiso específico
Route::delete('permissions/{permission}', [PermissionController::class, 'destroy']);

// Relaciones de permisos
Route::get('permissions/{permission}/roles', [PermissionController::class, 'getRoles']); // Obtener roles de un permiso


// Obtener todas las habitaciones
Route::get('rooms', [RoomController::class, 'index']);

// Obtener una habitación específica
Route::get('rooms/{room}', [RoomController::class, 'show']);

// Crear una nueva habitación
Route::post('rooms', [RoomController::class, 'store']);

// Actualizar una habitación específica
Route::put('rooms/{room}', [RoomController::class, 'update']);

// Eliminar una habitación específica
Route::delete('rooms/{room}', [RoomController::class, 'destroy']);

// Relaciones de habitaciones
Route::get('rooms/{room}/tasks', [RoomController::class, 'getTasks']); // Obtener tareas de una habitación
Route::get('rooms/{room}/users', [RoomController::class, 'getUsers']); // Obtener usuarios asignados a una habitación
Route::get('rooms/{room}/statuses', [RoomController::class, 'getStatuses']); // Obtener estados de una habitación


// Obtener todas las tareas
Route::get('tasks', [TaskController::class, 'index']);

// Obtener una tarea específica
Route::get('tasks/{task}', [TaskController::class, 'show']);

// Crear una nueva tarea
Route::post('tasks', [TaskController::class, 'store']);

// Actualizar una tarea específica
Route::put('tasks/{task}', [TaskController::class, 'update']);

// Eliminar una tarea específica
Route::delete('tasks/{task}', [TaskController::class, 'destroy']);

// Relaciones de tareas
Route::get('tasks/{task}/rooms', [TaskController::class, 'getRooms']); // Obtener habitaciones asociadas a una tarea

// Obtener todos los estados
Route::get('statuses', [StatusController::class, 'index']);

// Obtener un estado específico
Route::get('statuses/{status}', [StatusController::class, 'show']);

// Crear un nuevo estado
Route::post('statuses', [StatusController::class, 'store']);

// Actualizar un estado específico
Route::put('statuses/{status}', [StatusController::class, 'update']);

// Eliminar un estado específico
Route::delete('statuses/{status}', [StatusController::class, 'destroy']);

// Relaciones de estados
Route::get('statuses/{status}/rooms', [StatusController::class, 'getRooms']); // Obtener habitaciones asociadas a un estado

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/users', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->get('/users', [UserController::class, 'getUsersByHotel']);

Route::middleware('auth:sanctum')->get('/users', [UserController::class, 'index']);

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getAuthenticatedUser']);


Route::post('/rooms/create', [RoomController::class, 'store']);
Route::get('/rooms/hotel/{hotel_id}', [RoomController::class, 'getRoomsByHotel']);
Route::post('/rooms/import', [RoomController::class, 'importRooms']);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('statuses', StatusController::class);
Route::get('/statuses/hotel/{hotel_id}', [StatusController::class, 'getStatusByHotel']);
Route::apiResource('tasks', TaskController::class);
Route::get('/tasks/hotel/{hotel_id}', [TaskController::class, 'getTasksByHotel']);
Route::apiResource('plans', PlanController::class);
Route::post('/create-payment-intent', [PaymentController::class, 'createIntent']);
Route::post('/assign-rooms', [RoomUserController::class, 'assignRooms']);
Route::post('room-status/change-status', [RoomStatusController::class, 'changeRoomStatus']);
Route::post('assign-rooms/check-room-conflicts', [RoomUserController::class, 'checkRoomConflicts']);
Route::post('/room-tasks/assign', [RoomTaskController::class, 'assignTaskToRooms']);
Route::post('/room-task-logs', [RoomTaskLogController::class, 'store']);
Route::get('room-task-logs/logs/{hotelId}', [RoomTaskLogController::class, 'getLogs']);
Route::get('/rooms/{hotel_id}/date/{date}', [RoomController::class, 'getRoomsByHotel']);
Route::post('/invoice/download', [AuthController::class, 'downloadInvoice']);






