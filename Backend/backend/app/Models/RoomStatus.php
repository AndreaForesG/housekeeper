<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomStatus extends Model
{
    protected $table = 'room_statuses';

    protected $fillable = [
        'room_id', 'status_id',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
