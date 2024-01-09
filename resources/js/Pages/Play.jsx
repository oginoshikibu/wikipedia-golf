import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';


export default function Play({ const: startPageTitle = "ゲーム", const: goalPageTitle = "ゴルフ" }) {

    const wikiFetch = async (title) => {
        let url = encodeURI(`https://ja.wikipedia.org/w/rest.php/v1/page/${title}/with_html`);
        const rsp = await fetch(url);
        const data = await rsp.json();
        return data;
    }

    const wikiFetchAsync = async (title) => {
        try {
            let result = await wikiFetch(title);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }
    
    
    const [currentPageHtml, setCurrentPageHtml] = useState(null);
    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(0);


    const updateCurrentPage = async (title) => {
        let result = await wikiFetchAsync(title);
        setCurrentPageHtml(result.html);
        setCurrentPageTitle(result.title);
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
        <>
            <Head title="Play" />
            <div className='text-center w-[100%] m-3'>
                <p>start page: {startPageTitle} {"→"} goal page: {goalPageTitle}</p>
                <p>現在の打数: {currentScore} 打</p>
            </div>
            {currentPageTitle && (
                <>
                    <div>{currentPageTitle}</div>
                    <iframe srcDoc={currentPageHtml} title={currentPageTitle} className="m-4" width="100%" height={100000} tabIndex={-1} />
                </>
            )}
        </>
    );
}