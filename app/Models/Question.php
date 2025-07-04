<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $primaryKey = 'question_id';
    
    protected $fillable = [
        'start_page',
        'goal_page',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the answers for this question.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class, 'question_id', 'question_id');
    }

    /**
     * Get the latest question for today's challenge.
     */
    public static function getTodaysQuestion(): ?self
    {
        return self::where('created_at', '>', now()->subDay()->startOfDay())
            ->where('created_at', '<', now()->startOfDay())
            ->latest()
            ->first();
    }
}
