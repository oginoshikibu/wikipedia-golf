<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\MediawikiService;

class RandomPlayController extends Controller
{
    public function play()
    {
        // $mediawikiService = new MediawikiService();
        // $twoRandomPageTitles = $mediawikiService->getRandomJaWikiPagesTitles(2);   
        return Inertia::render('Play',
            [
                'startPageTitle' => "こんにちは",
                'goalPageTitle' => "さようなら",
                // 'startPageTitle' => $twoRandomPageTitles[0],
                // 'goalPageTitle' => $twoRandomPageTitles[1],
            ]
    );
    }
}
