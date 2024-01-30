import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import wikiPageViewer from '@/Components/wikiPageViewer';
import ErrorBoundary from '@/Components/ErrorBoundary';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Play({auth, startPageTitle, goalPageTitle, questionId = null}) {

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

    // init
    useEffect(() => {
        updateCurrentPage(startPageTitle);
        setPlayHistory([startPageTitle]);
        setPlayHistoryStack([startPageTitle]);
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
                <div>
                    {playHistory}
                </div>
                <div>
                    {playHistoryStack}
                </div>
                
                <div className='text-center m-3'>
                    <p>start page: {startPageTitle} {"→"} goal page: {goalPageTitle}</p>
                    <p>現在のページ: {currentPageTitle}, 現在の打数: {currentScore} 打</p>
                </div>

                <div className='flex justify-center m-3'>
                    <div className='w-[99%] border p-5'>
                        {wikiPageViewer(currentPageTitle,updateCurrentPage)}
                    </div>
                </div>
            </>
        </ErrorBoundary>
    );
}