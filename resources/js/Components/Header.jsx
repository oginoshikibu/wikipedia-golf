import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header({ auth, children }) {
    return (
        <>
            <div className="flex w-full h-16 bg-white shadow z-50">
                <a href={route('welcome')}>
                    <img src="img/sport010.svg" className='h-14 m-1 flex-none' />
                </a>
                <div className='flex-1 flex justify-center h-16'>
                    <div className='flex items-center'>
                        {children}
                    </div>
                </div>
                <div className='flex-2 flex justify-end h-16'>
                    <div className='flex items-center mr-3'>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="font-semibold text-gray-600 hover:text-rose-600 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-gray-600 hover:text-rose-600 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="ms-4 font-semibold text-gray-600 hover:text-rose-600 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
