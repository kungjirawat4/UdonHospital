

import Image from 'next/image';
import { useEffect, useState } from 'react';

import moph from '#/public/images/logo_MOPH.png';
import logo from '#/public/images/LOGO2.png';

type HeaderProps = {
  params: { slug: string };
};

const Header: React.FC<HeaderProps> = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [AA, setAA] = useState<string>('num1');

  useEffect(() => {
    const currentUrl = window.location.pathname;
    console.log('URL ปัจจุบัน:', currentUrl);

    if (currentUrl.startsWith('/kiosk')) {
      const urlEndsWith = currentUrl.split('/').pop();
      console.log('ส่วนสุดท้ายของ URL:', urlEndsWith);

      if (urlEndsWith === '1') {
        setAA('num1');
        console.log('ตั้งค่า AA เป็น: num1');
      } else if (urlEndsWith === '2') {
        setAA('num2');
        console.log('ตั้งค่า AA เป็น: num2');
      } else if (urlEndsWith === '3') {
        setAA('num3');
        console.log('ตั้งค่า AA เป็น: num3');
      } else {
        setAA('num1');
        console.log('ไม่พบหมายเลข ตั้งค่า AA เป็น num1');
      }
    } else {
      setAA('num1');
      console.log('URL ไม่ตรงตามเงื่อนไข ตั้งค่า AA เป็น num1');
    }
  }, []);

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
  // console.log('วันที่ปัจจุบัน:', today);

  return (
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
        <b>{today}</b>
      </div>
    </header>
  );
};

export default Header;
