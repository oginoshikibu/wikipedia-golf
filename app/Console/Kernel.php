<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Services\MediawikiService;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->call(function () {
            $mediawikiService = new MediawikiService();
            $twoRandomPageTitles = $mediawikiService->getRandomJaWikiPagesTitles(2);
            // log
            Log::info('twoRandomPageTitles[0] = ' . $twoRandomPageTitles[0]);
            Log::info('twoRandomPageTitles[1] = ' . $twoRandomPageTitles[1]);
        })->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
