/* eslint-disable react-dom/no-missing-button-type */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react-refresh/only-export-components */
'use clinet';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { FaEraser, FaSearch, FaTrash } from 'react-icons/fa';
import { ReactBarcode, Renderer } from 'react-jsbarcode';
import { toast, ToastContainer } from 'react-toastify';

import useApi from '@/hooks/useApi';
import Qrcodeline from '#/public/images/qrcodeline.png';

type SidebarProps = {
  setFoundPatient: (patient: any) => void;
};
const Sidebar: React.FC<SidebarProps> = ({ setFoundPatient }) => {
  const [q, setQ] = useState('');
  const [patient, setPatient] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const printRef = useRef(null);
  const [foundPatientprint] = useState<any>(null);
  const now = new Date();
  const date = now.toLocaleDateString('th-TH');
  const time = now.toLocaleTimeString('th-TH');

  const getApi = useApi({
    key: ['prescriptionview'],
    method: 'GET',
    url: `medicine/prescriptionview`,
  })?.get;

  // useEffect(() => {
  //   setPatient(getApi?.data?.data);
  // }, [getApi?.data?.data]);
    useEffect(() => {
      const interval = setInterval(() => {
        getApi?.refetch();
        setPatient(getApi?.data?.data);
      }, 30000); // ตั้งเวลาให้เช็คทุก 10 วินาที
  
  
  
      // ทำการล้าง interval เมื่อคอมโพเนนต์จะถูกลบออกหรือเมื่อ getApi หรือข้อมูลมีการเปลี่ยนแปลง
      return () => clearInterval(interval);
    }, [getApi]);
  if (inputRef.current) { /* empty */ }

  const handleCheckData = () => {
    // console.log(`ตรวจสอบข้อมูล: ${window.location.href}`);

    // console.log('searchTerm', q);
    // console.log('api', patient);

    if (!q) {
      // console.log('กรุณากรอกข้อมูลในช่องค้นหา');
      toast.warn('กรุณากรอกข้อมูลในช่องค้นหา');
      inputRef.current?.focus();
      getApi?.refetch();
      return;
    }

    const foundPatient = patient?.find(
      p =>
        // (p.queue_code && p.queue_code.includes(q))
        (p.queue_code && !p.queue_code.startsWith('F') && p.queue_code.includes(q))
      // || (p.hnCode && p.hnCode.includes(q))
      ,
    );

    if (foundPatient) {
      // console.log('พบข้อมูล', foundPatient);
      setFoundPatient(foundPatient);
      setQ('');
      inputRef.current?.focus();
      getApi?.refetch();
    } else {
      // console.log('ไม่พบข้อมูลที่ตรงกับการค้นหา');
      toast.warn('ไม่พบข้อมูลที่ตรงกับการค้นหา');
      setQ('');
      inputRef.current?.focus();
      getApi?.refetch();
    }

    setQ('');
  };

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 bg-pink-100 sm:grid-cols-1">
      <div className="mt5 w-full px-2">
        {/* Input ค้นหา */}
        <div className="flex items-center rounded-full px-4 py-2">
          <div>
            <div className="flex items-center rounded-full">
              <div className="flex w-full items-center space-x-2">
                <div className="flex w-full items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="ค้นหา..."
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="h-25 w-full rounded-2xl bg-white px-3 text-7xl shadow-md focus:outline-none"
                    onKeyDown={event => handleKeyPress(event, handleCheckData)}
                    onBlur={() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  />
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleCheckData}
                  onKeyDown={event => handleKeyPress(event, handleCheckData)}
                  className="4xl:text-6xl flex h-auto w-56 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 active:bg-green-800 md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl"
                >
                  <FaSearch className="h-24 w-full rounded-xl bg-green-600 text-8xl" />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {/* ตัวเลข 1-3 และ A */}
              {[1, 2, 3].map(num => (
                <button
                  key={num}

                  className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-blue-600 text-white ${window.innerWidth >= 1920
                    ? 'text-8xl'
                    : window.innerWidth >= 1536
                      ? 'text-6xl'
                      : window.innerWidth >= 1280
                        ? 'text-5xl'
                        : window.innerWidth >= 1024
                          ? 'text-4xl'
                          : 'text-2xl'
                  }`}
                  onClick={() => setQ(prev => prev + num)}
                >
                  {num}
                </button>
              ))}
              <button
                className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-pink-500 text-white ${window.innerWidth >= 1920
                  ? 'text-8xl'
                  : window.innerWidth >= 1536
                    ? 'text-6xl'
                    : window.innerWidth >= 1280
                      ? 'text-5xl'
                      : window.innerWidth >= 1024
                        ? 'text-4xl'
                        : 'text-2xl'
                }`}
                onClick={() => setQ(prev => `${prev}A`)}
              >
                A
              </button>
              {/* ตัวเลข 4-6 และ B */}
              {[4, 5, 6].map(num => (
                <button
                  key={num}
                  className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-blue-600 text-white ${window.innerWidth >= 1920
                    ? 'text-8xl'
                    : window.innerWidth >= 1536
                      ? 'text-6xl'
                      : window.innerWidth >= 1280
                        ? 'text-5xl'
                        : window.innerWidth >= 1024
                          ? 'text-4xl'
                          : 'text-2xl'
                  }`}
                  onClick={() => setQ(prev => prev + num)}
                >
                  {num}
                </button>
              ))}
              <button
                className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-pink-500 text-white ${window.innerWidth >= 1920
                  ? 'text-8xl'
                  : window.innerWidth >= 1536
                    ? 'text-6xl'
                    : window.innerWidth >= 1280
                      ? 'text-5xl'
                      : window.innerWidth >= 1024
                        ? 'text-4xl'
                        : 'text-2xl'
                }`}
                onClick={() => setQ(prev => `${prev}B`)}
              >
                B
              </button>
              {/* ตัวเลข 7-9 และ C */}
              {[7, 8, 9].map(num => (
                <button
                  key={num}
                  className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-blue-600 text-white ${window.innerWidth >= 1920
                    ? 'text-8xl'
                    : window.innerWidth >= 1536
                      ? 'text-6xl'
                      : window.innerWidth >= 1280
                        ? 'text-5xl'
                        : window.innerWidth >= 1024
                          ? 'text-4xl'
                          : 'text-2xl'
                  }`}
                  onClick={() => setQ(prev => prev + num)}
                >
                  {num}
                </button>
              ))}
              <button
                className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-pink-500 text-white ${window.innerWidth >= 1920
                  ? 'text-8xl'
                  : window.innerWidth >= 1536
                    ? 'text-6xl'
                    : window.innerWidth >= 1280
                      ? 'text-5xl'
                      : window.innerWidth >= 1024
                        ? 'text-4xl'
                        : 'text-2xl'
                }`}
                onClick={() => setQ(prev => `${prev}C`)}
              >
                C
              </button>
              {/* ปุ่มล้าง, ตัวเลข 0, และ ลบ, D */}
              <button
                className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-red-600 text-white ${window.innerWidth >= 1920
                  ? 'text-8xl'
                  : window.innerWidth >= 1536
                    ? 'text-6xl'
                    : window.innerWidth >= 1280
                      ? 'text-5xl'
                      : window.innerWidth >= 1024
                        ? 'text-4xl'
                        : 'text-2xl'
                }`}
                onClick={() => setQ('')}
              >
                <FaEraser className="text-20% text-white" />
                {' '}
                {/* X icon for clear */}
              </button>
              <button
                className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-blue-600 text-white ${window.innerWidth >= 1920
                  ? 'text-8xl'
                  : window.innerWidth >= 1536
                    ? 'text-6xl'
                    : window.innerWidth >= 1280
                      ? 'text-5xl'
                      : window.innerWidth >= 1024
                        ? 'text-4xl'
                        : 'text-2xl'
                }`}
                onClick={() => setQ(prev => prev + 0)}
              >
                0
              </button>
              <button
                className={`flex h-40 w-full max-w-4xl items-center   justify-center rounded-xl bg-red-600 text-white ${window.innerWidth >= 1920
                  ? 'text-8xl'
                  : window.innerWidth >= 1536
                    ? 'text-6xl'
                    : window.innerWidth >= 1280
                      ? 'text-5xl'
                      : window.innerWidth >= 1024
                        ? 'text-4xl'
                        : 'text-2xl'
                }`}
                onClick={() => setQ(prev => prev.slice(0, -1))}
              >
                <FaTrash className="text-20% text-white" />
                {' '}
                {/* Trash icon */}
              </button>
              <button
                className={`flex h-40 w-full max-w-4xl items-center justify-center rounded-xl bg-pink-500 text-white ${window.innerWidth >= 1920
                  ? 'text-8xl'
                  : window.innerWidth >= 1536
                    ? 'text-6xl'
                    : window.innerWidth >= 1280
                      ? 'text-5xl'
                      : window.innerWidth >= 1024
                        ? 'text-4xl'
                        : 'text-2xl'
                }`}
                onClick={() => setQ(prev => `${prev}D`)}
              >
                D
              </button>
              {/* <button
          className={`h-40 col-span-2 max-w-4xl rounded-xl bg-pink-500 text-white flex justify-center items-center ${
            window.innerWidth >= 1920
              ? 'text-8xl'
              : window.innerWidth >= 1536
              ? 'text-6xl'
              : window.innerWidth >= 1280
              ? 'text-5xl'
              : window.innerWidth >= 1024
              ? 'text-4xl'
              : 'text-2xl'
          }`}
           onClick={() => setQ(prev => `${prev}F`)}
        >
          <FaBarcode className="mr-4" /> {/* Barcode Icon

        </button> */}
              {/* ปุ่มสำหรับตรวจสอบและพิมพ์คิว */}
              <div className="mt-6 w-full grow px-4">
                <div className="flex items-center justify-between"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Section */}
      <div ref={printRef} className="hidden print:block">
        {foundPatientprint && (
          <div key={foundPatientprint.id} className="text-center">
            <div className="text-2xl font-bold">คิวรับยา</div>
            <br />
            <div className="text-2xl font-bold">
              {foundPatientprint.queue_code}
            </div>
            <br />
            <div className="text-lg font-bold">ห้องยาชั้น 2</div>
            <br />
            <div className="text-2xl font-bold">
              HN:
              {' '}
              {foundPatientprint.hnCode}
            </div>
            <br />
            <div className="text-xs">
              ชื่อ-นามสกุล:
              {' '}
              {foundPatientprint.full_name}
            </div>
            <br />
            <div className="text-lg font-bold">โรงพยาบาลอุดรธานี</div>
            <br />
            <div className="flex justify-center">
              <ReactBarcode
                value={foundPatientprint.hnCode}
                options={{
                  format: 'CODE128',
                  width: 1,
                  height: 50,
                  displayValue: true,
                  background: 'rgba(0, 0, 0, 0)',
                }}
                renderer={Renderer.CANVAS}
              />
            </div>
            <br />
            <div className="text-xs">{`${date} ${time}`}</div>
            <br />
            <div className="text-lg font-bold">รับข้อความเรียกคิวผ่านออฟไลน์</div>
            <div className="flex justify-center">
              <Image src={Qrcodeline} alt="" width={100} height={100} />
            </div>
            <div className="text-lg font-bold">Official Line @udhospital</div>
            <div className="text-xs">***ขั้นตอนการรับข้อความเรียกคิวผ่านไลน์***</div>
            <div className="px-3 text-left">
              <div className="text-xs">1. แสกนคิวอาร์โค้ดด้านบน หรือ แอดไลน์ @udhospital</div>
              <div className="text-xs">2. เข้า Official Line โรงพยาบาลอุดรธานี</div>
              <div className="text-xs">3. กดเมนูยืนยันตัวตนและทำการยืนยันตัวตน</div>
              <div className="text-xs">4. เมื่อถึงเวลารับยาจะมีข้อความแจ้งเตือนไปยังไลน์โรงพยาบาลอุดรธานี้</div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
      />
    </div>
  );
};
export default dynamic(() => Promise.resolve(Sidebar), { ssr: false });
