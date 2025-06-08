<?php

use App\Http\Controllers\PlanningController;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('email:send-daily', function () {
    (new App\Http\Controllers\PlanningController)->sendDailyPlannings();
})->describe('Enviar correos diarios');
