<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomTask extends Model
{
    protected $table = 'room_tasks';

    protected $fillable = [
        'room_id', 'task_id', 'start_date','end_date'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function roomTaskLogs()
    {
        return $this->hasMany(RoomTaskLog::class);
    }

    public function logs()
    {
        return $this->hasMany(RoomTaskLog::class);
    }







}
