<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomTaskLog extends Model
{
    use HasFactory;

    protected $table = 'room_task_logs';


    protected $fillable = [
        'room_task_id',
        'user_id',
        'is_done',
        'observation',
        'completed_at'
    ];

    public function roomTask()
    {
        return $this->belongsTo(RoomTask::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
