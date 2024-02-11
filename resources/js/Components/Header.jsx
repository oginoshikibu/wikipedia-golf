import React from 'react';
import AccountCircle from './AccountCircle';
import ApplicationLogo from './ApplicationLogo';

export default function Header({ auth, children }) {
    return (
        <>
            <div className="flex w-full h-16 bg-white border-b-2 z-50">
                <ApplicationLogo className='h-14 m-1 ml-3 flex-none' />
                {children}
                <div className='flex items-center h-16 mr-3 ml-auto'>
                    <AccountCircle auth={auth} className='h-14' />
                </div>
            </div>
        </>
    );
}
