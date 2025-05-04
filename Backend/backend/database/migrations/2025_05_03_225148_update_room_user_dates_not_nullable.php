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
        Schema::table('room_user', function (Blueprint $table) {
            $table->date('date_from')->nullable(false)->default(null)->change();
            $table->date('date_to')->nullable(false)->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('room_user', function (Blueprint $table) {
            $table->date('date_from')->default('2025-04-03')->change();
            $table->date('date_to')->default('2025-04-03')->change();
        });
    }
};
