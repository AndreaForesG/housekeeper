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
        Schema::table('room_statuses', function (Blueprint $table) {
            $table->timestamp('date')->default(DB::raw('CURRENT_TIMESTAMP'))->after('status_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('room_statuses', function (Blueprint $table) {
            $table->dropColumn('date');
        });
    }
};
