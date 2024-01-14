import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import wikiPageViewer from '@/Components/wikiPageViewer';
import ErrorBoundary from '@/Components/ErrorBoundary';

export default function Play({ const: startPageTitle = "ゲーム", const: goalPageTitle = "ゴルフ" }) {

    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(0);


    const updateCurrentPage = async (title) => {
        setCurrentPageTitle(title);
        setCurrentScore(currentScore + 1);
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
                    <p>現在の打数: {currentScore} 打</p>
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