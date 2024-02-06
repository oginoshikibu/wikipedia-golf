import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header({ auth, children }) {
    return (
        <>
            <div className="fixed top-0 w-full h-16 bg-white shadow z-50">
                <img src="img/sport010.svg" className='h-14 m-1'/>
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className='h-16'></div> {/* for padding */}
        </>
    );
}
