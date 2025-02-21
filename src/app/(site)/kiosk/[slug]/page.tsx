/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
// const kiosk = ({ params }: { params: { slug: string } }) => {
//   return <div>{params.slug}</div>;
// };
// export default kiosk;
'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';

import moph from '#/public/images/logo_MOPH.png';
import logo from '#/public/images/LOGO2.png';

import Kiosk from '../page';

// const kiosk = ({ params }: { params: { slug: string | undefined } }) => {
const kiosk = ({ params: paramsPromise }: { params: Promise<{ slug: string }> }) => {
  const params = use(paramsPromise);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [AA, setAA] = useState<string>('num1');

  const today = currentTime.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: '2-digit',

  });
  useEffect(() => {
    setInterval(() => setCurrentTime(new Date()), 1000);
  }, [today]);
  useEffect(() => {
    switch (params.slug) {
      case '1':
        setAA('num1');
        console.log('ตั้งค่า AA เป็น: num1');
        break;
      case '2':
        setAA('num2');
        console.log('ตั้งค่า AA เป็น: num2');
        break;
      case '3':
        setAA('num3');
        console.log('ตั้งค่า AA เป็น: num3');
        break;
      default:
        setAA('num1');
        console.log('ไม่พบ slug ที่ตรงเงื่อนไข, ตั้งค่า AA เป็น: num1');
    }
  }, [params.slug]);

  // console.log('วันที่ปัจจุบัน:', today);

  // console.log('วันที่ปัจจุบัน:', today);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex flex-col items-center bg-pink-500 p-2">
        <div className="flex w-full items-center justify-between">
          <Image src={logo} alt="Logo" width={120} height={120} />

          <div className="flex items-center">
            <span className="mx-2 text-7xl font-bold text-white">
              ตรวจสอบข้อมูล ที่นี่
            </span>
            <Image src={`/images/${AA}.png`} alt="Chock" width={130} height={130} />
            {' '}

          </div>

          <Image src={moph} alt="MOPH Logo" width={120} height={120} />
        </div>
        <div className="mt-4 text-white md:text-xl lg:text-2xl" suppressHydrationWarning>
          <b>
            <div suppressHydrationWarning>{today}</div>
          </b>
        </div>
      </header>
      <Kiosk />
    </div>
  );
};

export default kiosk;
