import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

/**
 * Custom hook for managing Wikipedia Golf game state
 * @param {string} startPageTitle - The starting page title
 * @param {string} goalPageTitle - The goal page title
 * @param {number|null} questionId - The question ID for today's challenge
 * @param {object} auth - Authentication object
 */
export function useGameState(startPageTitle, goalPageTitle, questionId, auth) {
    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(-1);
    const [playHistory, setPlayHistory] = useState([]);
    const [playHistoryStack, setPlayHistoryStack] = useState([]);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    
    const { data, setData, post } = useForm();

    const updateCurrentPage = (title) => {
        setCurrentPageTitle(title);
        setCurrentScore(prev => prev + 1);
        setPlayHistory(prev => [...prev, title]);
        setPlayHistoryStack(prev => [...prev, title]);
    };

    const backToPreviousPage = () => {
        if (playHistoryStack.length <= 1) return;
        
        const newPlayHistoryStack = playHistoryStack.slice(0, -1);
        const newCurrentPageTitle = playHistoryStack[playHistoryStack.length - 2];
        
        setCurrentPageTitle(newCurrentPageTitle);
        setCurrentScore(prev => prev + 1);
        setPlayHistory(prev => [...prev, newCurrentPageTitle]);
        setPlayHistoryStack(newPlayHistoryStack);
    };

    const activateHintModal = () => {
        setShowHintModal(true);
    };

    const shareOnTwitter = () => {
        const url = `https://twitter.com/intent/tweet?hashtags=WikipediaGolf&text=「${startPageTitle}」→「${goalPageTitle}」score: ${currentScore}%0a&url=https://wikipedia-golf.com`;
        window.open(url, '_blank');
    };

    const submitTodayAnswer = () => {
        if (!auth.user || !questionId) return;
        
        setData({
            questionId: questionId,
            score: currentScore,
            playHistory: JSON.stringify(playHistory),
        });
    };

    // Initialize game
    useEffect(() => {
        if (startPageTitle) {
            updateCurrentPage(startPageTitle);
        }
    }, [startPageTitle]);

    // Submit answer when data is set
    useEffect(() => {
        if (data.score && data.playHistory) {
            post(route('play.today.goal'));
        }
    }, [data]);

    // Check for goal achievement
    useEffect(() => {
        if (currentPageTitle && currentPageTitle === goalPageTitle) {
            setShowGoalModal(true);
            submitTodayAnswer();
        }
    }, [currentPageTitle, goalPageTitle]);

    return {
        // State
        currentPageTitle,
        currentScore,
        playHistory,
        playHistoryStack,
        showHintModal,
        showGoalModal,
        
        // Actions
        updateCurrentPage,
        backToPreviousPage,
        activateHintModal,
        shareOnTwitter,
        setShowHintModal,
        setShowGoalModal,
        
        // Computed values
        canGoBack: playHistoryStack.length > 1,
        previousPageTitle: playHistoryStack.length > 1 ? playHistoryStack[playHistoryStack.length - 2] : null,
    };
}