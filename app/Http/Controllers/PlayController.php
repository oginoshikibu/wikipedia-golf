<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\MediawikiService;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

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

    public function goal(Request $request): JsonResponse
    {   
        try {
            // 既に解答済みかどうかを確認
            if (Answer::where('user_id', $request->user()->id)
                ->where('question_id', $request->questionId)
                ->exists()
            ){
                return response()->json([
                    'success' => false,
                    'message' => 'Answer already submitted for this question.',
                    'error' => 'Duplicate submission'
                ], 400);
            }
            
            $answer = new Answer();
            $answer->user_id = $request->user()->id;
            $answer->question_id = $request->questionId;
            $answer->score = $request->score;
            $answer->play_history = $request->playHistory;
            $answer->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Answer submitted successfully.',
                'data' => [
                    'score' => $answer->score,
                    'answer_id' => $answer->id
                ]
            ], 200);
            
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
            ], 400);
            
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
            
        } catch (\Exception $e) {
            // Server error - unexpected failure
            Log::error('Unexpected error during answer submission', [
                'user_id' => $request->user()->id,
                'question_id' => $request->questionId,
                'error' => $e->getMessage(),
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
