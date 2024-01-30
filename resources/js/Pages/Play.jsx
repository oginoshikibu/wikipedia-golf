import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import wikiPageViewer from '@/Components/wikiPageViewer';
import ErrorBoundary from '@/Components/ErrorBoundary';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Play({ auth, startPageTitle, goalPageTitle, questionId = null }) {

    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(-1);
    const [playHistory, setPlayHistory] = useState([]);
    const [playHistoryStack, setPlayHistoryStack] = useState([]);


    const updateCurrentPage = async (title) => {
        setCurrentPageTitle(title);
        setCurrentScore(currentScore + 1);
        setPlayHistory([...playHistory, title]);
        setPlayHistoryStack([...playHistoryStack, title]);
    }

    const backToPreviousPage = async () => {
        const newPlayHistoryStack = playHistoryStack.slice(0, -1);
        const newCurrentPageTitle = playHistoryStack[playHistoryStack.length - 2];
        setCurrentPageTitle(newCurrentPageTitle);
        setCurrentScore(currentScore + 1);
        setPlayHistory([...playHistory, newCurrentPageTitle]);
        setPlayHistoryStack(newPlayHistoryStack);
    }

    // init
    useEffect(() => {
        updateCurrentPage(startPageTitle);
    }, [startPageTitle]);


    // judge goal
    useEffect(() => {
        if (currentPageTitle && currentPageTitle === goalPageTitle) {
            alert(currentScore + "打でゴールしました");
        }
    }, [currentPageTitle]);

    return (
        <ErrorBoundary>
            <>
                <Head title="Play" />
                <div className='text-center m-3'>
                    <p>start page: {startPageTitle} {"→"} goal page: {goalPageTitle}</p>
                    <p>現在のページ: {currentPageTitle}, 現在の打数: {currentScore} 打</p>
                </div>
                <div className='justify-center m-3'>
                    <div className='mb-3'>
                        <PrimaryButton disabled={playHistoryStack.length <= 1} onClick={backToPreviousPage}>
                            前ページ{
                                playHistoryStack.length <= 1 ? '' : '「' + playHistoryStack[playHistoryStack.length - 2] + '」'
                            }に1打で戻る
                        </PrimaryButton>
                    </div>
                    <div className='w-[99%] border p-5'>
                        {wikiPageViewer(currentPageTitle, updateCurrentPage)}
                    </div>
                </div>
            </>
        </ErrorBoundary>
    );
}