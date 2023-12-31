import { Head } from '@inertiajs/react';

export default function ResetPassword() {
    return (
        <>
            <Head title="Reset Password" />
            <div className="flex items-center justify-center mt-4">

                <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                    Password
                </label>
                <input
                    className="form-input rounded-md shadow-sm block w-full"
                    id="password"
                    type="password"
                    name="password"
                    required
                    autoFocus
                    autoComplete="current-password"
                />

                <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                    Password
                </label>
                <input
                    className="form-input rounded-md shadow-sm block w-full"
                    id="password"
                    type="password"
                    name="password"
                    required
                    autoFocus
                    autoComplete="current-password"
                />

                <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                    Password
                </label>
                <input
                    className="form-input rounded-md shadow-sm block w-full"
                    id="password"
                    type="password"
                    name="password"
                    required
                    autoFocus
                    autoComplete="current-password"
                />
            </div>
        </>
    );
}
