import { Head } from '@inertiajs/react';

export default function ConfirmEmail() {
    return (
        <>
            <Head title="Confirm Email" />
            <div className="flex items-center justify-center mt-4">
                {/* 確認したことを表示*/}
                <p className="text-sm text-gray-700 underline">
                    You have confirmed your email address!
                </p>
                
            </div>
        </>
    );
}