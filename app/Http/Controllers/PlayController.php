<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\MediawikiService;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;

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
                'questionId' => $todaysPageTitlesResponse['question_id'],
            ]
        );
    }

    public function goal(Request $request)
    {   
        // 既に解答済みかどうかを確認
        if (Answer::where('user_id', $request->user()->id)
            ->where('question_id', $request->questionId)
            ->exists()
        ){
            return;
        }
        $answer = new Answer();
        $answer->user_id = $request->user()->id;
        $answer->question_id = $request->questionId;
        $answer->score = $request->score;
        $answer->play_history = $request->playHistory;
        $answer->save();
        return;
    }

}
