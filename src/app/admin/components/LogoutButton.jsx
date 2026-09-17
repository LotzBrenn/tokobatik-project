'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/UserAction';

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await logoutAction();
        router.push('/login');
    }

    return (
        <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
        >
            🚪 Logout
        </button>
    );
}
