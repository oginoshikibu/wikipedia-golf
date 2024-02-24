<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Answer;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Get the user's play information.
     */
    public function play(Request $request): Response
    {
        $user = $request->user();
        $userAchievements = array();
        $answers = Answer::where('user_id', $user->id)->get();
        $userAchievements['Cleared'] = $answers->count();
        $userAchievements['Streaks'] = $this->countConsecutiveDays($answers);
        $userAchievements['Shortest Score'] = $answers->min('score');
        $userAchievements['Average Score'] = $answers->average('score');


        return Inertia::render('Dashboard', ['userAchievements' => $userAchievements]);
    }

    private function countConsecutiveDays($answers)
    {
        $answers = $answers->sortBy('created_at');
        $today = now();
        // 最終日が一昨日以前の場合は0を返す
        if ($answers->last()->created_at->lt($today->subDays())) {
            return 0;
        }

        // 最終日が今日の場合
        if ($answers->last()->created_at->toDateString() === $today->toDateString()) {
            $streaks = 0;
        
            $answers->sortByDesc('created_at')->each(function ($answer) use (&$streaks, $today) {
                if ($answer->created_at->toDateString() === $today->subDay($streaks)->toDateString()) {
                    $streaks++;
                } else {
                    return false;
                }
            });
            return $streaks;
        }

        // 最終日が昨日の場合
        if ($answers->last()->created_at->toDateString() === $today->subDay()->toDateString()) {
            $streaks = 1;
        
            $answers->sortByDesc('created_at')->each(function ($answer) use (&$streaks, $today) {
                if ($answer->created_at->toDateString() === $today->subDay($streaks)->toDateString()) {
                    $streaks++;
                } else {
                    return false;
                }
            $streaks--;
            });
            return $streaks;
        }

        // 例外処理
        return 0;
    }
}
