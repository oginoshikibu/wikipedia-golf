import { useState } from 'react';
import Header from '@/Components/Header';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function Authenticated({ auth, user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <Header auth={auth}>
                    <div className="space-x-8 -my-px ms-10 flex">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </NavLink>
                        <NavLink href={route('profile.edit')} active={route().current('profile.edit')}>
                            Profile
                        </NavLink>
                    </div>
                </Header>
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
