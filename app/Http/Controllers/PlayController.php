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
        // 昨日取得したランダムなページタイトルを取得
        $todaysPageTitlesResponse = Question::where('created_at', '>', now()->subDay())
            ->where('created_at', '<', now())
            ->get()
            ->pluck('start_page', 'goal_page')
            ->toArray();

        return Inertia::render(
            'Play',
            [
                'startPageTitle' => array_key_exists('start_page', $todaysPageTitlesResponse) ? $todaysPageTitlesResponse['start_page'] : null,
                'goalPageTitle' => array_key_exists('goal_page', $todaysPageTitlesResponse) ? $todaysPageTitlesResponse['goal_page'] : null,
            ]
        );
    }
}
