import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

// todo
// iframe をコンポーネントで作成する
// ヘッダーを作成する

export default function Play() {

    const [src, setSrc] = useState("https://ja.wikipedia.org/wiki/%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B2%E3%83%BC%E3%83%A0");

    const shot = (e) => {
        e.preventDefault();
        setSrc("https://ja.wikipedia.org/wiki/" + e.target.shot.value);

    };

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
                    onChange={(e) => shot(e.target.value)}
                />
                <PrimaryButton className=''>shot!!!</PrimaryButton>
            </form>
            
            <div className='overflow-auto h-[2000px] border-4 m-3'>
                <iframe src={src} className="m-4 pointer-events-none" width="100%" height="300000px" tabIndex={-1}/>
            </div>
        </>
    );
}