<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\MediawikiService;

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
}
