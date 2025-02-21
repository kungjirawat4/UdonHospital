// 'use client';

// import { useEffect, useState } from 'react';
// import useUserInfoStore from '@/zustand/userStore';
// import { Spinner } from '@nextui-org/react';
// const Logout = () => {
//     const [dots, setDots] = useState('');
//     useEffect(() => {
//         // เรียกใช้งาน logout จาก Zustand store
//         useUserInfoStore.getState().logout();
//     }, []);
// let interval: any;
//   useEffect(() => {

//       // eslint-disable-next-line react-hooks/exhaustive-deps
//       interval = setInterval(() => {
//         window.location.reload();
//         window.location.href = '/auth/login'
//       }, 2000);
//     // Clearing the interval
//     return () => clearInterval(interval);
//   }, []);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//             <span className="text-lg text-gray-700 dark:text-gray-300"><Spinner color="primary" />Logging out {dots}</span>
//         </div>
//     );
// };

// export default Logout;
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserInfoStore from '@/zustand/userStore';
import { Spinner } from '@nextui-org/react';

const Logout = () => {
    const router = useRouter();
    const [dots, setDots] = useState('');

    useEffect(() => {
        // เรียกใช้งาน logout จาก Zustand store
        useUserInfoStore.getState().logout();

        // เริ่มการเปลี่ยนเส้นทางและการอัปเดตจุดพร้อมกัน
        const logoutTimer = setTimeout(() => {
            router.push('/auth/login');
        }, 2000);

        const dotsInterval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 500);

        return () => {
            clearTimeout(logoutTimer);
            clearInterval(dotsInterval);
        };
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <span className="text-lg text-gray-700 dark:text-gray-300"><Spinner color="primary" /> Logging out{dots}</span>
        </div>
    );
};

export default Logout;
