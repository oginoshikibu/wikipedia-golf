import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import parse, {domToReact} from 'html-react-parser';

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
    
    const onClickWikiLink = (text, href) => {
        alert(text, href);
    }
    
    const updateLinksToPopups = (html) => {

        const replace  = (node) => {
            if (node.name === 'a') {
                    
                return (
                    <a {...node.attribs} href="#" title="hoge" onClick={(e) => {
                        e.preventDefault();
                        onClickWikiLink(validChildren.join(''), node.href);
                    }}>
                        {domToReact(node.children, replace)}
                    </a>
                );}
            else if (node.children) {
                return <>{domToReact(node.children, replace)}</>;
            }

            return;
        }
        
        return parse(html, replace);
    };
    
    const [currentPageHtml, setCurrentPageHtml] = useState(null);
    const [currentPageTitle, setCurrentPageTitle] = useState(null);
    const [currentScore, setCurrentScore] = useState(0);


    const updateCurrentPage = async (title) => {
        let result = await wikiFetchAsync(title);
        let updatedHtml = updateLinksToPopups(result.html);
        setCurrentPageHtml(updatedHtml);
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

            <div className='w-[80%]'>
                {currentPageHtml}
            </div>
        </>
    );
}