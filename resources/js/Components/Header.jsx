import React from 'react';
import { Link } from '@inertiajs/react';
import AccountCircle from './AccountCircle';
import ApplicationLogo from './ApplicationLogo';

export default function Header({ auth, children }) {
    return (
        <>
            <div className="flex w-full h-16 bg-white shadow z-50">
                <ApplicationLogo className='h-14 m-1 flex-none' />
                <div className="flex-1 flex justify-center items-center text-3xl font-bold">
                    Wikipedia Golf
                </div>
                <div className='flex-2 flex items-center h-16 mr-2'>
                    <AccountCircle auth={auth} className='h-14' />
                </div>
            </div>
        </>
    );
}
