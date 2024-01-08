import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

export default function Play({ const: startPageTitle = "ゲーム", const: goalPageTitle = "ゴルフ" }) {

    // https://www.mediawiki.org/wiki/API:REST_API/Reference/ja#HTMLの取得 よりコピペしたものを改変
    const wikiFetch = async (title) => {
        let url = `https://en.wikipedia.org/w/rest.php/v1/page/${title}/html`;
        let headers = { 'Api-User-Agent': 'MediaWiki REST API docs examples/0.1 (https://www.mediawiki.org/wiki/API_talk:REST_API)' }
        const rsp = await fetch(url, headers);
        const data = await rsp.json();
        return data;
    }

    const wikiFetchAsync = async (title) => {
        try {
            let result = await wikiFetch(title);
            console.log(result);
        } catch (err) {
            console.error(err.message);
        }
    }

    const modifyHtmlLinks = (html) => {
        // htmlの中のリンクを変更する
        // 1. htmlをパースする
        // 2. リンクのhrefを変更する
        // 3. 変更したhtmlを返す
        return html;
    }

    const getWikiPage = async (title) => {
        // media wiki apiを叩いて、titleのページのhtmlを取得する
        // https://www.mediawiki.org/wiki/API:Main_page
        const page = new Object();
        page.title = title;
        page.html = modifyHtmlLinks(wikiFetchAsync(title));
        return page;
    }

    const [currentPage, setCurrentPage] = useState(getWikiPage(startPageTitle));
    const [currentStrokes, setCurrentStrokes] = useState(0);

    const onLinkClickToHit = (e) => {
        setCurrentStrokes(currentStrokes + 1);
        setCurrentPage(getWikiPage(e.target.title));
    }

    useEffect(() => {
        if (currentPage.title === goalPageTitle) {
            alert(currentStrokes + "打でゴールしました");
        }
    }, [currentPage]);


    return (
        <>
            <Head title="Play" />
            <div className='text-center w-[100%] m-3'>
                <p>start page: {startPageTitle} {"→"} goal page: {goalPageTitle}</p>
                <p>現在の打数: {currentStrokes} 打</p>
            </div>
            <iframe srcDoc={currentPage.html} className="m-4" width="100%" tabIndex={-1} />
        </>
    );
}