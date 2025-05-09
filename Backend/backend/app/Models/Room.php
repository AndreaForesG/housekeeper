<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['hotel_id', 'number', 'floor'];

    public function hotel(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function tasks(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'room_tasks');
    }


    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function roomStatuses()
    {
        return $this->hasMany(RoomStatus::class);
    }

    public function roomUser()
    {
        return $this->hasOne(RoomUser::class);
    }

    public function assignments()
    {
        return $this->hasMany(RoomUser::class);
    }



}
