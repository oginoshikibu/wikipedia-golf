import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import wikiPageViewer from '@/Components/wikiPageViewer';
import ErrorBoundary from '@/Components/ErrorBoundary';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Play({ auth, startPageTitle, goalPageTitle, questionId = null }) {

    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(-1);
    const [playHistory, setPlayHistory] = useState([]);
    const [playHistoryStack, setPlayHistoryStack] = useState([]);
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm();

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

    useEffect(() => {
        if (data.score && data.playHistory) {
            post(route('play.today.goal'));
        }
    }, [data]);

    // 本日の一題終了時の処理
    const goalTodayQuestion = async () => {
        setData({
            questionId: questionId,
            score: currentScore,
            playHistory: JSON.stringify(playHistory),
        });
    }

    // judge goal
    useEffect(() => {
        if (currentPageTitle && currentPageTitle === goalPageTitle) {
            alert(currentScore + "打でゴールしました");
            if (auth.user && questionId) {
                goalTodayQuestion();
            }
        }
    }, [currentPageTitle]);

    return (
        <ErrorBoundary>
            <>
                <Head title="Play" />
                <Header auth={auth}>
                    <p>現在のページ: {currentPageTitle}, 現在の打数: {currentScore} 打</p>
                </Header>

                <div className='justify-center m-3'>

                        {wikiPageViewer(currentPageTitle, updateCurrentPage)}
                </div>
                <Footer>
                    <div className='m-3'>
                        <PrimaryButton disabled={playHistoryStack.length <= 1} onClick={backToPreviousPage}>
                            前ページ{
                                playHistoryStack.length <= 1 ? '' : '「' + playHistoryStack[playHistoryStack.length - 2] + '」'
                            }に1打で戻る
                        </PrimaryButton>
                    </div>
                    <div className='text-center m-3'>
                        <p>start page: {startPageTitle} {"→"} goal page: {goalPageTitle}</p>
                    </div>

                </Footer>
            </>
        </ErrorBoundary>
    );
}