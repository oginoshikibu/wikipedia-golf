import { Link } from '@inertiajs/react';
import AppHead from '@/Components/AppHead';
import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from '@/Components/PrimaryButton';
import AccountCircle from '@/Components/AccountCircle';

export default function Welcome({ auth }) {

    return (
        <>
            <AppHead title="Welcome" />
            <div className='fixed top-0 right-0 h-16 w-16 mr-3 z-50'>
                <AccountCircle auth={auth} className='absolute top-0 right-0 h-14 z-50' />
            </div>
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 selection:bg-red-500 selection:text-white">


                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    {/* logo */}
                    <div className="flex justify-center">
                        <ApplicationLogo className="w-40 h-40 fill-current" />
                    </div>
                    <div className="flex justify-center text-3xl font-bold">
                        Wikipedia Golf
                    </div>
                    <div className="flex justify-center text-lg m-2">
                        最小クリックでゴールページまでたどり着け！！
                    </div>

                    <div className="flex justify-center mt-5">
                        <Link href={route('play.today')}>

                            <PrimaryButton
                                className='mr-4'
                                type='button'
                            >
                                今日の一題
                            </PrimaryButton>
                        </Link>

                        <Link href={route('play.random')}>
                            <PrimaryButton
                                href={route('play.random')}
                                className='ml-4'
                            >
                                ランダムプレイ
                            </PrimaryButton>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
