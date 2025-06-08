<?php

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withKernels()
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware()
    ->withExceptions()
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('email:send-daily')->dailyAt('08:00');
    });

return $app->create();
