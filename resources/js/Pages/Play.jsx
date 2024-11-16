import React, { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppHead from '@/Components/AppHead';
import wikiPageViewer from '@/Components/wikiPageViewer';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';

const countUpIntervalSeconds = (countTime, setCountTime) => {
    useEffect(() => {
        const countDownInterval = setInterval(() => {
            setCountTime(countTime + 1)
        }, 1000)
        return () => {
            clearInterval(countDownInterval)
        }
    }, [countTime])
}

export default function Play({ auth, startPageTitle, goalPageTitle, errorCode = null, errorInfo = null, isRidaisai = false }) {
    const TIME_LIMIT_SECONDS = 10 * 60; // 10 minutes

    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(-1);
    const [playHistory, setPlayHistory] = useState([]);
    const [playHistoryStack, setPlayHistoryStack] = useState([]);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [goalTime, setGoalTime] = useState(null);
    const [showTimeOverModal, setShowTimeOverModal] = useState(false);

    countUpIntervalSeconds(elapsedSeconds, setElapsedSeconds);

    useEffect(() => {
        if (elapsedSeconds == TIME_LIMIT_SECONDS) {
            setShowTimeOverModal(true);
        }
    }, [elapsedSeconds]);

    const updateCurrentPage = async (title) => {
        if (title === currentPageTitle || !title) {
            console.log(errorCode);
            console.log(errorInfo);
            return;
        }
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

    const ridaisaiGoalSubmit = async (userName) => {
        if (!userName) {
            return;
        }
        const data = {
            score: currentScore,
            elapsedSeconds: goalTime,
            userName: userName,
            goalPageTitle: goalPageTitle,

        }
        console.log(data);
        router.post(route('play.ridaisai.goal'), data);
    }

    // judge goal
    useEffect(() => {
        if (currentPageTitle && currentPageTitle.replace(/_/g, ' ') === goalPageTitle.replace(/_/g, ' ')) {
            setGoalTime(elapsedSeconds);
            setShowGoalModal(true);
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

            <Modal show={showGoalModal} closeable={false} onClose={setShowGoalModal}>
                <div className='text-center'>
                    <div className='text-2xl font-bold'>
                        ゴール！
                    </div>
                    <div className='m-3'>
                        {playHistory.join("→")}
                    </div>
                    <div className='m-3'>
                        スコア：{currentScore} 打　経過時間：{String(Math.floor(goalTime / 60)).padStart(2, '0')}分{String(goalTime % 60).padStart(2, '0')}秒
                    </div>
                    <div className='m-3'>
                        {isRidaisai &&
                            <form onSubmit={(e) => { e.preventDefault(); ridaisaiGoalSubmit(e.target.userName.value); }}>
                                <input type="hidden" name="score" value={currentScore} />
                                <input type="hidden" name="elapsedSeconds" value={goalTime} />
                                <input name="userName" type="text" placeholder="ユーザー名" className='m-3' />
                                <PrimaryButton type="submit" className='m-3'>
                                    <span>
                                        スコアを登録
                                    </span>
                                </PrimaryButton>
                                {errorCode && <div className='text-red-500'>既に登録されているユーザー名です</div>}
                            </form>
                        }
                        <Link href={route("welcome")}>
                            <PrimaryButton className='m-3'>
                                <span>
                                    トップページへ
                                </span>
                            </PrimaryButton>
                        </Link>
                    </div>

                </div>
            </Modal>

            <Modal show={showTimeOverModal && !showGoalModal} closeable={false} onClose={setShowTimeOverModal}>
                <div className='text-center'>
                    <div className='text-2xl font-bold'>
                        時間切れです。
                    </div>
                    <div className='m-2'>
                        {playHistory.join("→")}
                    </div>
                    <div className='m-2'>
                        現在のスコア：{currentScore} 打
                    </div>
                    <div className='m-2'>
                        後ろに並んでいる人がいたら交代してください！！
                    </div>
                    <PrimaryButton onClick={() => { setShowTimeOverModal(false); }
                    } className='m-3'>
                        <span>
                            続けて遊ぶ
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
                <div className='my-auto py-1 ml-3 justify-center'>
                    <PrimaryButton disabled={playHistoryStack.length <= 1} onClick={backToPreviousPage} className='w-auto '>
                        前ページ{
                            playHistoryStack.length <= 1 ? '' : '「' + playHistoryStack[playHistoryStack.length - 2] + '」'
                        }に戻る (1打消費)
                    </PrimaryButton>
                </div>
                <div className='m-auto justify-center'>
                    現在のページ: 『{currentPageTitle}』 → ゴール: 『{goalPageTitle}』
                </div>
                <div className='my-2 mr-6 ml-2 justify-center'>
                    <div className='center'>
                        スコア：{currentScore}打
                    </div>
                    <div>
                        {TIME_LIMIT_SECONDS >= elapsedSeconds ? (
                            <>
                                残り時間：
                                {String(Math.floor((TIME_LIMIT_SECONDS - elapsedSeconds) / 60)).padStart(2, '0').split('').map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block', width: '1ch', textAlign: 'center' }}>
                                        {char}
                                    </span>
                                ))}
                                分
                                {String((TIME_LIMIT_SECONDS - elapsedSeconds) % 60).padStart(2, '0').split('').map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block', width: '1ch', textAlign: 'center' }}>
                                        {char}
                                    </span>
                                ))}
                                秒
                            </>
                        ) : (
                            <>
                                経過時間：
                                {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0').split('').map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block', width: '1ch', textAlign: 'center' }}>
                                        {char}
                                    </span>
                                ))}
                                分
                                {String(elapsedSeconds % 60).padStart(2, '0').split('').map((char, index) => (
                                    <span key={index} style={{ display: 'inline-block', width: '1ch', textAlign: 'center' }}>
                                        {char}
                                    </span>
                                ))}
                                秒
                            </>
                        )}
                    </div>
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