<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Answer;
use App\Models\Question;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class GameService
{
    /**
     * Get user's score for a specific question.
     */
    public function getUserScore(User $user, Question $question): ?int
    {
        $answer = Answer::where('user_id', $user->id)
            ->where('question_id', $question->question_id)
            ->first();

        return $answer ? $answer->score : null;
    }

    /**
     * Get user's ranking for a specific question.
     */
    public function getUserRanking(User $user, Question $question): ?int
    {
        $userScore = $this->getUserScore($user, $question);
        
        if ($userScore === null) {
            return null;
        }

        $betterScores = Answer::where('question_id', $question->question_id)
            ->where('score', '<', $userScore)
            ->distinct('user_id')
            ->count();

        return $betterScores + 1;
    }

    /**
     * Get leaderboard for a specific question.
     */
    public function getLeaderboard(Question $question, int $limit = 10): array
    {
        $answers = Answer::with('user')
            ->where('question_id', $question->question_id)
            ->orderBy('score', 'asc')
            ->orderBy('created_at', 'asc')
            ->limit($limit)
            ->get();

        return $answers->map(function ($answer, $index) {
            return [
                'rank' => $index + 1,
                'user_name' => $answer->user->name,
                'score' => $answer->score,
                'play_history' => $answer->play_history,
                'completed_at' => $answer->created_at,
            ];
        })->toArray();
    }

    /**
     * Get statistics for a specific question.
     */
    public function getQuestionStats(Question $question): array
    {
        $answers = Answer::where('question_id', $question->question_id)->get();
        
        if ($answers->isEmpty()) {
            return [
                'total_players' => 0,
                'average_score' => 0,
                'min_score' => 0,
                'max_score' => 0,
            ];
        }

        $scores = $answers->pluck('score');

        return [
            'total_players' => $answers->count(),
            'average_score' => round($scores->avg(), 2),
            'min_score' => $scores->min(),
            'max_score' => $scores->max(),
        ];
    }

    /**
     * Validate a play history path.
     */
    public function validatePlayHistory(array $playHistory, string $startPage, string $goalPage): bool
    {
        if (empty($playHistory)) {
            return false;
        }

        // Check if it starts with the start page
        if ($playHistory[0] !== $startPage) {
            return false;
        }

        // Check if it ends with the goal page
        if (end($playHistory) !== $goalPage) {
            return false;
        }

        return true;
    }

    /**
     * Calculate score based on play history.
     */
    public function calculateScore(array $playHistory): int
    {
        // Score is the number of page visits minus 1 (first page doesn't count)
        return max(0, count($playHistory) - 1);
    }

    /**
     * Submit an answer for a question.
     */
    public function submitAnswer(User $user, Question $question, array $playHistory): Answer
    {
        if (Answer::hasUserAnswered($user->id, $question->question_id)) {
            throw new Exception('User has already answered this question');
        }

        if (!$this->validatePlayHistory($playHistory, $question->start_page, $question->goal_page)) {
            throw new Exception('Invalid play history');
        }

        $score = $this->calculateScore($playHistory);

        $answer = Answer::create([
            'user_id' => $user->id,
            'question_id' => $question->question_id,
            'score' => $score,
            'play_history' => $playHistory,
        ]);

        Log::info('Answer submitted', [
            'user_id' => $user->id,
            'question_id' => $question->question_id,
            'score' => $score,
        ]);

        return $answer;
    }
}