<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('room_tasks', function (Blueprint $table) {
             $table->id();
             $table->unsignedBigInteger('room_id');
             $table->unsignedBigInteger('task_id');
             $table->timestamps();

             $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
             $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_tasks');
    }
};
