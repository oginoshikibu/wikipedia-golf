import React from 'react';
import { Link } from '@inertiajs/react';
import AppHead from '@/Components/AppHead';
import WikiPageViewer from '@/Components/wikiPageViewer';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Modal from '@/Components/Modal';
import { useGameState } from '@/hooks/useGameState';

export default function Play({ auth, startPageTitle, goalPageTitle, questionId = null }) {
    const gameState = useGameState(startPageTitle, goalPageTitle, questionId, auth);

    return (
        <>
            <AppHead title="Play" />
            <Header auth={auth}>
                <div className="flex-1 flex justify-center items-center text-3xl font-bold">
                    Wikipedia Golf
                </div>
            </Header>

            <div className='justify-center m-3'>
                <WikiPageViewer 
                    jaPageTitle={gameState.currentPageTitle} 
                    updateCurrentPage={gameState.updateCurrentPage} 
                    canUpdate={true}
                />
            </div>

            <Modal show={gameState.showHintModal} closeable={true} onClose={gameState.setShowHintModal}>
                <WikiPageViewer 
                    jaPageTitle={goalPageTitle} 
                    updateCurrentPage={() => {}} 
                    canUpdate={false}
                />
            </Modal>

            <Modal show={gameState.showGoalModal} closeable={true} onClose={gameState.setShowGoalModal}>
                <div className='text-center'>
                    <div className='text-2xl font-bold'>
                        ゴール！
                    </div>
                    <div className='m-3'>
                        {gameState.playHistory.join("→")}
                    </div>
                    <div className='m-3'>
                        スコア：{gameState.currentScore} 打
                    </div>
                    <PrimaryButton 
                        onClick={gameState.shareOnTwitter}
                        className='m-3'
                    >
                        結果をツイート
                    </PrimaryButton>
                    <Link href={route("welcome")}>
                        <PrimaryButton className='m-3'>
                            トップページへ
                        </PrimaryButton>
                    </Link>
                </div>
            </Modal>

            <Footer>
                <div className='my-auto py-1 ml-3'>
                    <PrimaryButton 
                        disabled={!gameState.canGoBack} 
                        onClick={gameState.backToPreviousPage} 
                        className='w-auto'
                    >
                        前ページ{gameState.previousPageTitle && `「${gameState.previousPageTitle}」`}に戻る (1打消費)
                    </PrimaryButton>
                </div>
                <div className='m-auto justify-center'>
                    現在のページ: 『{gameState.currentPageTitle}』 → ゴール: 『{goalPageTitle}』
                </div>
                <div className='my-auto mr-3 ml-auto'>
                    スコア：{gameState.currentScore}打
                </div>
                <div className='my-auto py-1 mr-3'>
                    <PrimaryButton onClick={gameState.activateHintModal} className='w-auto'>
                        ヒント：ゴールページを見る
                    </PrimaryButton>
                </div>
            </Footer>
        </>
    );
}