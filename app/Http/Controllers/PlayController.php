<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\MediawikiService;
use App\Models\Question;

class PlayController extends Controller
{
    public function random()
    {
        $mediawikiService = new MediawikiService();
        $twoRandomPageTitles = $mediawikiService->getRandomJaWikiPagesTitles(2);
        return Inertia::render(
            'Play',
            [
                'startPageTitle' => $twoRandomPageTitles[0],
                'goalPageTitle' => $twoRandomPageTitles[1],
            ]
        );
    }

    public function today()
    {
        // 昨日取得したうち、最新の問題を取得
        $todaysPageTitlesResponse = Question::where('created_at', '>', now()->subDay()->startOfDay())
            ->where('created_at', '<', now()->startOfDay())
            ->get()
            ->last()
            ->toArray();

        return Inertia::render(
            'Play',
            [
                'startPageTitle' => $todaysPageTitlesResponse['start_page'],
                'goalPageTitle' => $todaysPageTitlesResponse['goal_page'],
            ]
        );
    }
}
