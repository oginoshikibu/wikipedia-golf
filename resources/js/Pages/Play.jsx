import React, { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppHead from '@/Components/AppHead';
import wikiPageViewer from '@/Components/wikiPageViewer';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';

export default function Play({ auth, startPageTitle, goalPageTitle, questionId = null }) {

    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(-1);
    const [playHistory, setPlayHistory] = useState([]);
    const [playHistoryStack, setPlayHistoryStack] = useState([]);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
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

    const activateHintModal = () => {
        setShowHintModal(true);
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
            setShowGoalModal(true);
            if (auth.user && questionId) {
                goalTodayQuestion();
            }
        }
    }, [currentPageTitle]);

    return (
        <>
            <AppHead title="Play" />
            <Header auth={auth}>
                <div className="flex-1 flex justify-center items-center text-3xl font-bold">
                    Wikipedia Golf
                </div>
            </Header>

            <div className='justify-center m-3'>
                {wikiPageViewer(currentPageTitle, updateCurrentPage, true)}
            </div>


            <Modal show={showHintModal} closeable={true} onClose={setShowHintModal}>
                {wikiPageViewer(goalPageTitle, () => { }, false)}
            </Modal>

            <Modal show={showGoalModal} closeable={true} onClose={setShowGoalModal}>
                <div className='text-center'>
                    <div className='text-2xl font-bold'>
                        ゴール！
                    </div>
                    <div className='m-3'>
                        {playHistory.join("→")}
                    </div>
                    <div className='m-3'>
                        スコア：{currentScore} 打
                    </div>
                    <PrimaryButton onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?hashtags=WikipediaGolf&text=「${startPageTitle}」→「${goalPageTitle}」score: ${currentScore}%0a&url=https://wikipedia-golf.com`, '_blank')
                    }
                    } className='m-3'>
                        <span>
                            結果をツイート
                        </span>
                    </PrimaryButton>
                    <Link href={route("welcome")}>
                        <PrimaryButton className='m-3'>
                            <span>
                                トップページへ
                            </span>
                        </PrimaryButton>
                    </Link>
                </div>
            </Modal>

            <Footer>
                <div className='my-auto py-1 ml-3'>
                    <PrimaryButton disabled={playHistoryStack.length <= 1} onClick={backToPreviousPage} className='w-auto '>
                        前ページ{
                            playHistoryStack.length <= 1 ? '' : '「' + playHistoryStack[playHistoryStack.length - 2] + '」'
                        }に戻る (1打消費)
                    </PrimaryButton>
                </div>
                <div className='m-auto justify-center'>
                    現在のページ: 『{currentPageTitle}』 → ゴール: 『{goalPageTitle}』
                </div>
                <div className='my-auto mr-3 ml-auto'>
                    スコア：{currentScore}打
                </div>
                <div className='my-auto py-1 mr-3'>
                    <PrimaryButton onClick={activateHintModal} className='w-auto '>
                        <span>
                            ヒント：ゴールページを見る
                        </span>
                    </PrimaryButton>
                </div>

            </Footer>
        </>
    );
}