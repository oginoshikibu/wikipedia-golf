<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\MediawikiService;
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

    public function ridaisai()
    {

        return Inertia::render(
            'Play',
            [
                'startPageTitle' => '東京理科大学',
                'goalPageTitle' => '東京物理学校',
            ]
        );
    }

    public function ridaisaiGoal(Request $request)
    {
        $score = $request->score;
        $userName = $request->userName;
        $elapsedSeconds = $request->elapsedSeconds;
        $goalPageTitle = $request->goalPageTitle;

        if (!is_numeric($elapsedSeconds)) {
            return response()->json(['error' => 'Invalid elapsed seconds'], 400);
        }
        if (!is_numeric($score)) {
            return response()->json(['error' => 'Invalid score'], 400);
        }
        if ($elapsedSeconds >= 1000000) {
            return response()->json(['error' => 'Elapsed seconds too high'], 400);
        }

        # score + elapsedSeconds(6桁)の形式で、scoreを一つの数値に変換
        $score = $score * 1000000 + $elapsedSeconds;

        $endpoint = "http://54.84.41.124:8080";
        $client = new \GuzzleHttp\Client();
        try {
            $client->post($endpoint, [
                'json' => [
                    'score' => $score,
                    'username' => $userName,
                ]
            ]);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            // Log the error or handle it as needed
            $e->getResponse();
            return Inertia::render('Play', [
                'errorCode' => $e->getResponse()->getStatusCode(),
                'goalPageTitle' => $goalPageTitle,
                'errorInfo' => $e->getResponse()->getBody()->getContents(),
            ]);
        }

        return to_route('welcome');
    }

    public function goal(Request $request)
    {
        // 既に解答済みかどうかを確認
        if (Answer::where('user_id', $request->user()->id)
            ->where('question_id', $request->questionId)
            ->exists()
        ) {
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
