<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Services\MediawikiService;
use App\Models\Question;

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
            $question = new Question();
            $question->start_page = $twoRandomPageTitles[0];
            $question->goal_page = $twoRandomPageTitles[1];
            $question->save();
        })->daily()->at('10:00');
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
