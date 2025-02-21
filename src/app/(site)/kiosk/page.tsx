
'use client';
import 'react-toastify/ReactToastify.css';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { FaPrint, FaTimes } from 'react-icons/fa';
import { ReactBarcode, Renderer } from 'react-jsbarcode';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';

import Qrcodeline from '#/public/images/qrcodeline.png';

import Footer from './_components/Footer';
import Sidebar from './_components/sidebar';

const Kiosk: React.FC = () => {
  const [, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const printRef = useRef(null);
  const [foundPatient, setFoundPatient] = useState<any>(null);
  const [foundPatientprint, setFoundPatientprint] = useState<any>(null);
  const now = new Date();
  const date = now.toLocaleDateString('th-TH');
  const time = now.toLocaleTimeString('th-TH');

  const handlePrintPatient = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => {
      toast.success('ปริ้นสำเร็จ');
    },
  });

  const handlePrintQueue = async () => {
    if (!foundPatient) {
      toast.warn('กรุณาค้นหาผู้ป่วยก่อน');
      inputRef.current?.focus();
      return;
    }

    setFoundPatientprint(foundPatient);

    if (!printRef.current) {
      toast.warn('ไม่มีข้อมูลสำหรับพิมพ์');
      return;
    }

    try {
      handlePrintPatient();

      setQ('');
      inputRef.current?.focus();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`เกิดข้อผิดพลาดในการพิมพ์: ${error.message}`);
      } else {
        toast.error(`เกิดข้อผิดพลาดในการพิมพ์: ${String(error)}`);
      }
    }
  };

  const handleClose = () => {
    setFoundPatient(null);
  };

  const getStatusTextClass = () => {
    if (window.innerWidth >= 1920) {
      return 'text-7xl';
    }
    if (window.innerWidth >= 1536) {
      return 'text-6xl';
    }
    if (window.innerWidth >= 1280) {
      return 'text-5xl';
    }
    if (window.innerWidth >= 1024) {
      return 'text-4xl';
    }
    return 'text-2xl';
  };

  const getStatusTextClass1 = () => {
    if (window.innerWidth >= 1920) {
      return 'text-6xl';
    }
    if (window.innerWidth >= 1536) {
      return 'text-5xl';
    }
    if (window.innerWidth >= 1280) {
      return 'text-4xl';
    }
    if (window.innerWidth >= 1024) {
      return 'text-3xl';
    }
    return 'text-2xl';
  };
  // console.log(`ตรวจสอบข้อมูล: ${window.location.href}`);
  const currentUrl = window.location.href;
  const lastSegment = currentUrl.split('/').pop();

  let kioskMessage = '  ';

  if (lastSegment === '1') {
    kioskMessage += 'K1';
  } else if (lastSegment === '2') {
    kioskMessage += 'K2';
  } else if (lastSegment === '3') {
    kioskMessage += 'K3';
  } else {
    kioskMessage += `K${lastSegment}`;
  }

  return (

    <div className="flex grow">
      <Sidebar setFoundPatient={setFoundPatient} />
      <div className="flex h-auto w-[60vw] flex-col items-center justify-center bg-gray-50 p-4">
        {foundPatient ? (
          <div className="flex w-full flex-col rounded-xl bg-white p-6 shadow-lg md:p-10">

            <div className="space-y-4">
              <div className="flex flex-col space-y-6">

                <div className="flex items-center justify-end">
                  <div className="flex items-center rounded-lg border-2 border-black p-3">

                    <p className={`font-semibold text-black ${getStatusTextClass()}`}>
                      สถานะ :
                      {' '}
                      {foundPatient.prescrip_status || ' ไม่ทราบ'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col space-y-3">
                      <p className={`font-semibold text-black ${getStatusTextClass()}`}>
                        หมายเลขรับบริการ :
                        <span className={`font-semibold text-black ${getStatusTextClass()}`}>
                          {foundPatient.queue_code || ' ไม่ทราบ '}
                        </span>
                      </p>

                    </div>

                    <p className={`font-semibold text-black ${getStatusTextClass1()}`}>

                      {' '}
                      {foundPatient.full_name}
                    </p>
                    <div className="mt-3 flex w-full justify-between">

                      <p className={`font-semibold text-black ${getStatusTextClass()}`}>
                        HN :
                        {' '}
                        {foundPatient.hnCode || 'ไม่ทราบ'}
                      </p>
                    </div>

                    <div className="mt-3 flex w-full justify-between">
                      <p className={`font-semibold text-black ${getStatusTextClass()}`}>
                        คาดว่าได้รับยา
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className={`font-semibold text-black ${getStatusTextClass()}`}>
                        {' '}
                        {(() => {
                          const createdAt = new Date(foundPatient.createdAt);
                          const updatedAt = new Date(foundPatient.updatedAt);
                          if (!isNaN(createdAt.getTime()) && !isNaN(updatedAt.getTime())) {
                            const diffTime = updatedAt.getTime() - createdAt.getTime();

                            const estimatedTime = new Date(updatedAt.getTime() + diffTime / 2);
                            return estimatedTime.toLocaleString('th-TH', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            });
                          } else {
                            return 'ไม่ทราบ';
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleClose}

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
                >
                  <FaTimes className="text-20% text-white" />
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handlePrintQueue}
                  onKeyDown={event =>
                    event.key === 'Enter' ? handlePrintQueue() : null}
                  className={`flex h-40 w-full max-w-4xl items-center   justify-center rounded-xl bg-green-600 text-white ${window.innerWidth >= 1920
                    ? 'text-8xl'
                    : window.innerWidth >= 1536
                      ? 'text-6xl'
                      : window.innerWidth >= 1280
                        ? 'text-5xl'
                        : window.innerWidth >= 1024
                          ? 'text-4xl'
                          : 'text-2xl'
                  }`}
                >
                  <FaPrint className="text-20% text-white" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center">
              <p className={`text-black ${getStatusTextClass()}`}>
                กรุณาเลือกทางด้านซ้าย
              </p>

            </div>

          </div>
        )}
        {' '}

        <div ref={printRef} className="hidden print:block">
          {foundPatientprint && (
            <div key={foundPatientprint.id} className="text-center">
              <div className="text-3xl font-bold leading-tight">คิวรับยา</div>
              <br />
              <div className="text-3xl font-bold leading-tight">
                {foundPatientprint.queue_code}
              </div>
              <br />
              <div className="text-2xl font-bold leading-tight">
                ห้องยาชั้น 2
              </div>
              <br />
              <div className="text-3xl font-bold leading-tight">
                HN:
                {' '}
                {foundPatientprint.hnCode}
              </div>
              <br />
              <div className="text-sm leading-tight">
                ชื่อ-นามสกุล:
                {' '}
                {foundPatientprint.full_name}
              </div>
              <br />
              <div className="text-base font-bold leading-tight">
                อายุรกรรมทั่วไป
              </div>
              <br />
              <div className="text-base font-bold leading-tight">
                โรงพยาบาลอุดรธานี
              </div>
              <br />
              <div className="flex justify-center leading-tight">
                <ReactBarcode
                  value={foundPatientprint.queue_code}
                  options={{
                    format: 'CODE128',
                    width: 1,
                    height: 40,
                    displayValue: true,
                    background: 'rgba(0, 0, 0, 0)',
                  }}
                  renderer={Renderer.SVG}
                />
              </div>
              <br />
              <div className="text-sm font-bold leading-tight">{`${date} ${time}`}</div>
              <br />
              <div className="text-base font-bold leading-tight">
                รับข้อความเรียกคิวผ่านแอฟไลน์
              </div>
              <div className="flex justify-center leading-tight">
                <Image src={Qrcodeline} alt="" width={120} height={100} />
                {' '}

              </div>
              <div className="text-base font-bold  leading-tight">
                Official Line @udhospital
              </div>
              <div className="text-xs font-bold leading-tight">
                ***ขั้นตอนการรับข้อความเรียกคิวผ่านไลน์***
              </div>
              <div className="px-3 text-left leading-tight">
                <div className="text-xs font-bold leading-tight">
                  1. แสกนคิวอาร์โค้ดด้านบน
                  <div className="px-3 text-left leading-tight">

                    หรือ แอดไลน์ @udhospital
                  </div>
                </div>
                <div className="text-xs font-bold leading-tight">
                  2. เข้า Official Line โรงพยาบาลอุดรธานี
                </div>
                <div className="text-xs font-bold leading-tight">
                  3. กดเมนูยืนยันตัวตนและทำการยืนยันตัวตน
                </div>
                <div className="text-xs font-bold leading-tight">
                  4.
                  เมื่อถึงเวลารับยาจะมีข้อความแจ้งเตือนไปยังไลน์โรงพยาบาลอุดรธานี
                </div>
              </div>

              <div className="px-3 text-left leading-tight">
                <div className="pr-5 text-right text-sm leading-tight">{kioskMessage}</div>
                {' '}

              </div>

            </div>
          )}
        </div>

        {' '}
      </div>

      <Footer />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Kiosk), { ssr: false });
