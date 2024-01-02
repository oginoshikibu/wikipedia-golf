import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Iframe from '@/Components/Iframe';
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

            <form onSubmit={shot}>
                <TextInput
                    id="shot"
                    type="text"
                    name="shot"
                    className="mt-1 block w-full"
                    autoComplete="shot"
                    onChange={(e) => shot(e.target.value)}
                />
                <PrimaryButton>shot!!!</PrimaryButton>
            </form>
            
            <Iframe src={src} className="mt-4" width="100%" height="1000px" />
        </>
    );
}