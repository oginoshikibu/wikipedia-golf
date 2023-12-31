import { Head } from '@inertiajs/react';

export default function Play() {
    return (
        <>
            <Head title="Play" />
            <div className="mt-4">
                <iframe src="https://ja.wikipedia.org/wiki/%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B2%E3%83%BC%E3%83%A0" width="100%" height="1000px"></iframe>
            </div>
        </>
    );
}