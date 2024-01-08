import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Play({ const: startPageTitle = "ゲーム", const: goalPageTitle = "ゴルフ" }) {

    // mock default value
    const startUrl = "https://ja.wikipedia.org/wiki/" + startPageTitle;
    const goalUrl = "https://ja.wikipedia.org/wiki/" + goalPageTitle;

    // https://www.mediawiki.org/wiki/API:REST_API/Reference/ja#HTMLの取得 よりコピペ
    async function wikiFetch(title) {
        let url = `https://en.wikipedia.org/w/rest.php/v1/page/${title}/html`;
        let headers = {'Api-User-Agent': 'MediaWiki REST API docs examples/0.1 (https://www.mediawiki.org/wiki/API_talk:REST_API)'}
        
      
        const rsp = await fetch(url, headers);
        const data = await rsp.json();
        return data;
      }
      
      async function fetchAsync()
      {
        try {
          let result = await doFetch();
          console.log(result);
        } catch( err ) {
          console.error( err.message );
        }
      }
      
      fetchAsync();


    const getAllLinks = (wikiUrl) => {
        // media wiki apiを叩いて、wikiUrlのページのリンクを取得する
        // https://www.mediawiki.org/wiki/API:Main_page
        const links = new Set();
        // debag mock用
        links.add(goalUrl);
        links.add("https://ja.wikipedia.org/wiki/テニス");
        links.add("https://ja.wikipedia.org/wiki/サッカー");
        links.add("https://ja.wikipedia.org/wiki/野球");
        return links;
    }

    const canShot = (currentWikiUrl, nextWikiUrl) => {
        // currentWikiUrlからnextWikiUrlに移動できるかどうかを判定する
        // 1. currentWikiUrlのページのリンクを取得する
        // 2. nextWikiUrlがそのリンクの中にあるかどうかを判定する
        // 3. あればtrue,なければfalseを返す
        const links = getAllLinks(currentWikiUrl);
        return links.has(nextWikiUrl);
    }


    const [src, setSrc] = useState(startUrl);
    const [currentStrokes, setCurrentStrokes] = useState(0);

    useEffect(() => {
        if (src === goalUrl) {
            alert(currentStrokes + "打でゴールしました");
        }
    }, [src]);

    const shot = (e) => {
        e.preventDefault();
        const nextWikiUrl = ("https://ja.wikipedia.org/wiki/" + e.target.shot.value);
        if (nextWikiUrl === src) {
            alert("同じページです");
        } else if (canShot(src, nextWikiUrl)) {
            setSrc(nextWikiUrl);
            setCurrentStrokes(currentStrokes + 1);
        } else {
            alert("そのページには移動できません");
        }
    }

    return (
        <>

            <Head title="Play" />
            <div className='text-center w-[100%] m-3'>
                <p>start page: {startPageTitle} {"→"} goal page: {goalPageTitle}</p>
                <p>現在の打数: {currentStrokes} 打</p>
            </div>
            <form onSubmit={shot} className='flex items-center m-3'>
                <TextInput
                    id="shot"
                    type="text"
                    name="shot"
                    className="block w-[100%] mr-3"
                    autoComplete="shot"
                />
                <PrimaryButton>shot!!!</PrimaryButton>
            </form>

            <div className='overflow-auto h-[2000px] border-4 m-3'>
                <iframe src={src} className="m-4 pointer-events-none" width="100%" height="300000px" tabIndex={-1} />
            </div>
        </>
    );
}