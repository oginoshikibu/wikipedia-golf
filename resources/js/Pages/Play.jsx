import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Play({startUrl="",goalUrl=""}) {

    // mock default value
    if (startUrl === ""){startUrl = "https://ja.wikipedia.org/wiki/play"}
    if (goalUrl === ""){goalUrl = "https://ja.wikipedia.org/wiki/golf"}


    const getAllLinks = (wikiUrl) => {
        // media wiki apiを叩いて、wikiUrlのページのリンクを取得する
        // https://www.mediawiki.org/wiki/API:Main_page
        const links = new Set();
        return links;
    }

    const canShot = (currentWikiUrl,nextWikiUrl) => {
        // currentWikiUrlからnextWikiUrlに移動できるかどうかを判定する
        // 1. currentWikiUrlのページのリンクを取得する
        // 2. nextWikiUrlがそのリンクの中にあるかどうかを判定する
        // 3. あればtrue,なければfalseを返す
        const links = getAllLinks(currentWikiUrl);
        return links.has(nextWikiUrl);
    }


    const [src, setSrc] = useState(startUrl);

    const shot = (e) => {
        e.preventDefault();
        const nextWikiUrl=("https://ja.wikipedia.org/wiki/" + e.target.shot.value);
        if (canShot(src,nextWikiUrl)){
            setSrc(nextWikiUrl);
        } else {
            alert("そのリンクは無効です");
        }
        if (src === goalUrl){
            alert("ゴールです！");
        }
    }

    return (
        <>

            <Head title="Play" />

            <form onSubmit={shot} className='flex items-center m-3'>
                <TextInput
                    id="shot"
                    type="text"
                    name="shot"
                    className="block w-[100%] mr-3"
                    autoComplete="shot"
                />
                <PrimaryButton className=''>shot!!!</PrimaryButton>
            </form>
            
            <div className='overflow-auto h-[2000px] border-4 m-3'>
                <iframe src={src} className="m-4 pointer-events-none" width="100%" height="300000px" tabIndex={-1}/>
            </div>
        </>
    );
}