<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitAnswerRequest;
use App\Models\Answer;
use App\Models\Question;
use App\Services\GameService;
use App\Services\MediawikiService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
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
    public function goal(SubmitAnswerRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $question = Question::findOrFail($request->questionId);
            $playHistory = $request->getPlayHistoryArray();

            $answer = $this->gameService->submitAnswer($user, $question, $playHistory);

            return response()->json([
                'success' => true,
                'message' => '回答を提出しました',
                'data' => [
                    'score' => $answer->score,
                    'answer_id' => $answer->id,
                ]
            ]);

        } catch (ValidationException $e) {
            // Client error - validation failed
            Log::warning('Validation failed for answer submission', [
                'user_id' => $request->user()->id,
                'question_id' => $request->questionId,
                'errors' => $e->errors()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid data provided. Please check your input.',
                'error' => 'Validation failed'
            ], 422);

        } catch (ModelNotFoundException $e) {
            // Client error - resource not found
            Log::warning('Resource not found during answer submission', [
                'user_id' => $request->user()->id,
                'question_id' => $request->questionId
            ]);

            return response()->json([
                'success' => false,
                'message' => 'The requested resource was not found.',
                'error' => 'Resource not found'
            ], 404);

        } catch (Exception $e) {
            // Server error - unexpected failure
            Log::error('Failed to submit answer', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
                'question_id' => $request->questionId,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting your answer. Please try again later.',
                'error' => 'Internal server error'
            ], 500);
        }
    }
}
