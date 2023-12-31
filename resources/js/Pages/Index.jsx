import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title="Index" />
            <div className="flex items-center justify-center mt-4">
                <a
                    className="text-sm text-gray-700 underline"
                >
                    Log in / Sign up
                </a>
                <a
                    className="ml-4 text-sm text-gray-700 underline"
                >
                    How to Play
                </a>
                <a
                    className="ml-4 text-sm text-gray-700 underline"
                >
                    Play
                </a>
            </div>
        </>
    );
}
