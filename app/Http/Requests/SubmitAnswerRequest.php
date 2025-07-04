<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'questionId' => 'required|integer|exists:questions,question_id',
            'playHistory' => 'required|string|max:10000',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'questionId.required' => '問題IDが必要です。',
            'questionId.exists' => '指定された問題が存在しません。',
            'playHistory.required' => 'プレイ履歴が必要です。',
            'playHistory.max' => 'プレイ履歴が長すぎます。',
        ];
    }

    /**
     * Get the validated play history as an array.
     *
     * @return array
     */
    public function getPlayHistoryArray(): array
    {
        $playHistory = json_decode($this->playHistory, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('Invalid JSON in play history');
        }
        
        return $playHistory;
    }
}