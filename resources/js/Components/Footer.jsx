import React from 'react';

export default function Footer({ auth, children }) {
    return (
        <>
            <div className='h-16'></div>
            <div className="fixed bottom-0 flex w-full h-16 bg-white border-t-2 border z-50">
                {children}
            </div>
        </>
    );
}
