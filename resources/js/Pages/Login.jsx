import { Head } from '@inertiajs/react';

export default function Login() {
    return (
        <>
            <Head title="Login" />
            <div className="mt-4">
                <label className="block font-medium text-sm text-gray-700" htmlFor="email">
                    Email
                </label>
                <input
                    className="form-input rounded-md shadow-sm block w-full"
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoFocus
                    autoComplete="email"
                />
            </div>
        </>
    );
}
