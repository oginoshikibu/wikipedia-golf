<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    use HasFactory;

    protected $primaryKey = 'answer_id';
    
    protected $fillable = [
        'user_id',
        'question_id',
        'score',
        'play_history',
    ];

    protected $casts = [
        'play_history' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who submitted this answer.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the question this answer belongs to.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id', 'question_id');
    }

    /**
     * Check if user has already answered this question.
     */
    public static function hasUserAnswered(int $userId, int $questionId): bool
    {
        return self::where('user_id', $userId)
            ->where('question_id', $questionId)
            ->exists();
    }
}
