<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitAnswerRequest;
use App\Models\Answer;
use App\Models\Question;
use App\Services\GameService;
use App\Services\MediawikiService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PlayController extends Controller
{
    public function __construct(
        private readonly MediawikiService $mediawikiService,
        private readonly GameService $gameService
    ) {}

    /**
     * Get a random Wikipedia Golf game.
     */
    public function random(): Response
    {
        try {
            $twoRandomPageTitles = $this->mediawikiService->getRandomJaWikiPagesTitles(2);
            
            return Inertia::render('Play', [
                'startPageTitle' => $twoRandomPageTitles[0],
                'goalPageTitle' => $twoRandomPageTitles[1],
            ]);
        } catch (Exception $e) {
            Log::error('Failed to get random pages', ['error' => $e->getMessage()]);
            
            return Inertia::render('Play', [
                'startPageTitle' => 'エラー',
                'goalPageTitle' => 'エラー',
                'error' => 'ページの取得に失敗しました。もう一度お試しください。',
            ]);
        }
    }

    /**
     * Get today's Wikipedia Golf challenge.
     */
    public function today(): Response
    {
        try {
            $todaysQuestion = Question::getTodaysQuestion();
            
            if (!$todaysQuestion) {
                Log::warning('No question found for today');
                return redirect()->route('play.random');
            }

            return Inertia::render('Play', [
                'startPageTitle' => $todaysQuestion->start_page,
                'goalPageTitle' => $todaysQuestion->goal_page,
                'questionId' => $todaysQuestion->question_id,
            ]);
        } catch (Exception $e) {
            Log::error('Failed to get today\'s question', ['error' => $e->getMessage()]);
            return redirect()->route('play.random');
        }
    }

    /**
     * Submit an answer for today's challenge.
     */
    public function goal(SubmitAnswerRequest $request): void
    {
        try {
            $user = $request->user();
            $question = Question::findOrFail($request->questionId);
            $playHistory = $request->getPlayHistoryArray();

            $this->gameService->submitAnswer($user, $question, $playHistory);

        } catch (Exception $e) {
            Log::error('Failed to submit answer', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
                'question_id' => $request->questionId,
            ]);
        }
    }
}
