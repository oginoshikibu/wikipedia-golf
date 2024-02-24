import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({auth, userAchievements}) {

    return (
        <AuthenticatedLayout
            auth={auth}
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <section>
                            <div className="p-6 text-gray-900">
                                <h2 className="text-lg font-medium text-gray-900">Achievement</h2>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {Object.keys(userAchievements).map((key) => (
                                        <div className="bg-gray-100 p-4 rounded" key={key}>
                                            <h3 className="text-sm font-medium text-gray-500">{key}</h3>
                                            <p className="text-lg font-semibold text-gray-900">{userAchievements[key]}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className='mt-4 text-sm text-gray-600'>※集計対象は「今日の一題」のみです</div>
                            </div>
                        </section>

                    </div>
                </div>
            </div >
        </AuthenticatedLayout >
    );
}
