'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, Tooltip } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

import { TopLoadingBar } from '@/components/common/TopLoadingBar';
import useToasts from '@/hooks/use-toasts';
import { DateTimeLongTH, TimeOnlyTH, TimeOnlyTH1 } from '@/libs/dateTime';
import ApiCall from '@/services/api';
import StatusModal from './model/StatusModal';

type QueueData = {
  id: string;
  prescripCode: string;
  urgent: boolean;
  basket_num: number;
  hnCode: string;
  vnCode: string;
  queue_code: string;
  queue_num: string;
  doctor_names: string;
  lap_name: string;
  dept_name: string;
  dept_code: string;
  drug_allergy: string;
  pay_type: string;
  queue_random: string;
  queue_type: string;
  full_name: string;
  medicine_total: number;
  medicine_price: number;
  medicine_service: number;
  prescrip_status: string;
  delivery: boolean;
  startTime: string;
  arrangTime: string;
  userDoubleCheck: boolean;
  checkTime: string;
  userDispense: string;
  userDispenseTime: string;
  restBasket: string;
  userRestBasket: string;
  prescrip_comment: string;
  prescripAdd: string;
  hospitalId: string;
  userId: string;
  basketId: string;
  autoLoad: boolean;
  cabinetId: string;
  firstIssTime: string;
  lastDispense: Date;
  lastDiff: string;
  dateQueue: string;
  createdAt: string;
  updatedAt: string;
  channel: string;
  channel2: string;
  autoload: boolean;
  basket: string;
  arranged: boolean;
};
const MainForm = () => {
  const { toastSuccess, toastWarning } = useToasts();
  const [selectedA, setSelectedA] = useState<{ [key: number]: string }>({});
  const [selectedB, setSelectedB] = useState<{ [key: number]: string }>({});
  const [selectedC, setSelectedC] = useState<{ [key: number]: string }>({});
  const [selectedD, setSelectedD] = useState<{ [key: number]: string }>({});
  const [pid, setId] = useState<string | null>(null);
  const [service, setservice] = useState<string | null>(null);
  const [idEdit, setIdEdit] = useState<QueueData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSelectedNum, setCurrentSelectedNum] = useState<number | null>(null);
  const [_currentSide, setCurrentSide] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const getApi = ApiCall({
    key: ['prescriptionv'],
    method: 'GET',
    url: `medicine/prescriptionview`,
  })?.get;
  const updateApi = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription`,
  })?.put;
  const data = getApi?.data?.data;
  // console.log(data);
  let interval: any;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    interval = setInterval(() => {
      getApi?.refetch();
    }, 15000);

    // Clearing the interval
    return () => clearInterval(interval);
  }, [getApi]);
  useEffect(() => {
    // อัปเดตสถานะโดยดูจาก queue_code และ prescrip_status
    const updatedA = { ...selectedA };
    const updatedB = { ...selectedB };
    const updatedC = { ...selectedC };
    const updatedD = { ...selectedD };

    data?.forEach((item: { queue_code: any; prescrip_status: string; queue_type: string; medicine_service: number }) => {
      if (item.queue_type === 'A') {
        const normalizedCode = item.queue_code.replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด

        // eslint-disable-next-line eqeqeq
        if (item.medicine_service == 1 && (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ')) {
          updatedA[normalizedCode] = 'จัดยาแล้ว';
          // eslint-disable-next-line eqeqeq
        } else if (item.medicine_service == 1) {
          updatedA[normalizedCode] = 'มีใบแนบ';
        } else if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
          updatedA[normalizedCode] = 'จัดยาแล้ว';
        } else if (item.prescrip_status === 'รอจับคู่ตะกร้า') {
          updatedA[normalizedCode] = 'รอจับคู่ตะกร้า';
        } else if (item.prescrip_status === 'กำลังตรวจสอบ') {
          updatedA[normalizedCode] = 'กำลังตรวจสอบ';
        } else if (item.prescrip_status === 'กำลังจัดยา') {
          updatedA[normalizedCode] = 'กำลังจัดยา';
        } else if (item.prescrip_status === 'ยกเลิก') {
          updatedA[normalizedCode] = 'ยกเลิก';
        }

      } else if (item.queue_type === 'B') {
        const normalizedCode = item.queue_code.replace(/^F/, '').replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
        // const normalizedCode = item.queue_code.replace(/^0+/, '').replace(/^F/, ''); // ตัด F ออกก่อนประมวลผล
        // eslint-disable-next-line eqeqeq
        if (item.medicine_service == 1) {
          updatedA[normalizedCode] = 'มีใบแนบ';
        } else if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
          updatedB[normalizedCode] = 'จัดยาแล้ว';
        } else if (item.prescrip_status === 'รอจับคู่ตะกร้า' || item.prescrip_status === 'กำลังจัดยา') {
          updatedB[normalizedCode] = 'รอจับคู่ตะกร้า';
        } else if (item.prescrip_status === 'กำลังตรวจสอบ') {
          updatedA[normalizedCode] = 'กำลังตรวจสอบ';
        } else if (item.prescrip_status === 'กำลังจัดยา') {
          updatedA[normalizedCode] = 'กำลังจัดยา';
        } else if (item.prescrip_status === 'ยกเลิก') {
          updatedA[normalizedCode] = 'ยกเลิก';
        }
      } else if (item.queue_type === 'C') {
        const normalizedCode = item.queue_code.replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
        // eslint-disable-next-line eqeqeq
        if (item.medicine_service == 1) {
          updatedA[normalizedCode] = 'มีใบแนบ';
        } else if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
          updatedC[normalizedCode] = 'จัดยาแล้ว';
        } else if (item.prescrip_status === 'รอจับคู่ตะกร้า' || item.prescrip_status === 'กำลังจัดยา') {
          updatedC[normalizedCode] = 'รอจับคู่ตะกร้า';
        } else if (item.prescrip_status === 'กำลังตรวจสอบ') {
          updatedA[normalizedCode] = 'กำลังตรวจสอบ';
        } else if (item.prescrip_status === 'กำลังจัดยา') {
          updatedA[normalizedCode] = 'กำลังจัดยา';
        } else if (item.prescrip_status === 'ยกเลิก') {
          updatedA[normalizedCode] = 'ยกเลิก';
        }
      } else if (item.queue_type === 'D') {
        // const normalizedCode = item.queue_code.replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
        const normalizedCode = item.queue_code.replace(/^F/, '').replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
        // eslint-disable-next-line eqeqeq
        if (item.medicine_service == 1) {
          updatedA[normalizedCode] = 'มีใบแนบ';
        } else if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
          updatedD[normalizedCode] = 'จัดยาแล้ว';
        } else if (item.prescrip_status === 'รอจับคู่ตะกร้า' || item.prescrip_status === 'กำลังจัดยา') {
          updatedD[normalizedCode] = 'รอจับคู่ตะกร้า';
        } else if (item.prescrip_status === 'กำลังตรวจสอบ') {
          updatedA[normalizedCode] = 'กำลังตรวจสอบ';
        } else if (item.prescrip_status === 'กำลังจัดยา') {
          updatedA[normalizedCode] = 'กำลังจัดยา';
        } else if (item.prescrip_status === 'ยกเลิก') {
          updatedA[normalizedCode] = 'ยกเลิก';
        }
      }
    });

    setSelectedA(updatedA);
    setSelectedB(updatedB);
    setSelectedC(updatedC);
    setSelectedD(updatedD);
    // console.log(updatedB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // console.log('A', selectedA);
  // console.log('B', selectedB);
  // const handleNumberClick = (num: number, side: 'A' | 'B' | 'C' | 'D') => {
  //   setCurrentSelectedNum(num);
  //   setCurrentSide(side);
  //   setIsModalOpen(true);

  //   const normalizedNum = num.toString().padStart(3, '0');
  //   // ค้นหาข้อมูลที่เกี่ยวข้องจาก data
  //   const queueData = data?.find(

  //     (item: { queue_code: string; queue_type: string }) =>
  //       item.queue_code === normalizedNum && item.queue_type === side,
  //   );
  //   setservice('ไม่มีใบแนบ'); // ค่าเริ่มต้น

  //   if (queueData && Number(queueData.medicine_service) === 1) {
  //     setservice('มีใบแนบ');
  //   }

  //   setId(queueData?.id);
  //   setIdEdit(queueData);
  // };
  const handleNumberClick = (num: number, side: 'A' | 'B' | 'C' | 'D') => {
    setCurrentSelectedNum(num);
    setCurrentSide(side);
    setIsModalOpen(true);

    const normalizedNum = num.toString().padStart(3, '0'); // แปลงเป็น 3 หลัก เช่น 005
    const queueCodeWithF = `F${normalizedNum}`; // เพิ่มตัว F ข้างหน้า เช่น F005

    let queueData;

    if (side === 'B' || side === 'D') {
      // ถ้าเป็นฝั่ง B หรือ D ให้ลองหาทั้งแบบมี F และไม่มี F
      queueData = data?.find(
        (item: { queue_code: string; queue_type: string }) =>
          (item.queue_code === normalizedNum || item.queue_code === queueCodeWithF) &&
          item.queue_type === side
      );
    } else {
      // ฝั่ง A หรือ C ให้ใช้แค่แบบไม่มี F
      queueData = data?.find(
        (item: { queue_code: string; queue_type: string }) =>
          item.queue_code === normalizedNum && item.queue_type === side
      );
    }

    setservice('ไม่มีใบแนบ'); // ค่าเริ่มต้น

    if (queueData && Number(queueData.medicine_service) === 1) {
      setservice('มีใบแนบ');
    }

    setId(queueData?.id);
    setIdEdit(queueData);
  };

  const handleupdatestatus = async () => {
    try {
      // อัปเดตข้อมูลทั้งหมดพร้อมกัน
      await updateApi?.mutateAsync({
        id: pid,
        station: true,
        queueStatus: 'ยกเลิก',
      });
      toastSuccess('ยกเลิกสำเร็จ');
      // ดึงข้อมูลใหม่หลังจากอัปเดตเสร็จ
      getApi?.refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error confirming arrangement:', error);
      toastWarning('เกิดข้อผิดพลาดในการยืนยัน');
    }
  };
  const handleupdate = async () => {
    try {
      // อัปเดตข้อมูลทั้งหมดพร้อมกัน
      await updateApi?.mutateAsync({
        id: pid,
        station: true,
        medicine_service: 1,
      });
      toastSuccess('อัพเดทสำเร็จ');
      // ดึงข้อมูลใหม่หลังจากอัปเดตเสร็จ
      getApi?.refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error confirming arrangement:', error);
      toastWarning('เกิดข้อผิดพลาดในการยืนยัน');
    }
  };
  const handleclear = async () => {
    try {
      // อัปเดตข้อมูลทั้งหมดพร้อมกัน
      await updateApi?.mutateAsync({
        id: pid,
        station: true,
        medicine_service: 0,
      });
      toastSuccess('อัพเดทสำเร็จ');
      // ดึงข้อมูลใหม่หลังจากอัปเดตเสร็จ
      getApi?.refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error confirming arrangement:', error);
      toastWarning('เกิดข้อผิดพลาดในการยืนยัน');
    }
  };
  const generateNumbers = (start: number, end: number, columns: number) => {
    const rows: string[][] = [];
    for (let i = start; i <= end; i += columns) {
      const row: string[] = [];
      for (let j = i; j < i + columns && j <= end; j++) {
        // เติมเลข 0 ด้านหน้าให้เป็น 3 หลัก
        row.push(j.toString().padStart(3, '0'));
      }
      rows.push(row);
    }
    return rows;
  };

  const Queue1 = generateNumbers(1, 140, 5);
  const Queue2 = generateNumbers(1, 800, 10); // เปลี่ยนเริ่มต้นจาก 0 เป็น 1
  // console.log('Q1', Queue1);
  // console.log('Q2', Queue2);
  return (

    <>
      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <div className="flex justify-center">
        <StatusModal />
      </div>
      <Tabs
        color="danger"

        className="w-full"
        aria-label="Queue Type Tabs"
      >
        <Tab key="A" title="A">
          <h2 className="mb-2 text-center text-lg">คิวรับยาปกติ A</h2>
          <div className="grid grid-cols-10 gap-2">
            {Queue2.map(row =>
              row.map((num) => {
                const normalizedNum = num.toString().padStart(3, '0');
                const queueItem = data?.find((item: any) => item.queue_code === normalizedNum && item.queue_type === 'A');
                // console.log('num', num);
                // console.log('num0', normalizedNum);

                return (
                  <Tooltip
                    key={num}
                    content={
                      selectedA[Number(num)]
                        ? `หมายเลข ${num}: ${selectedA[Number(num)]}`
                        : ''
                    }
                    placement="top"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer rounded border p-2 text-center ${Number(num) === 0
                        ? 'bg-gray-300 text-black'
                        : selectedA[Number(num)] === 'จัดยาแล้ว'
                          ? selectedA[Number(num)] === 'แนบใบสั่ง'
                            ? 'border-pink-500 bg-green-500 text-white'
                            : 'bg-green-500 text-white'
                          : selectedA[Number(num)] === 'มีใบแนบ'
                            ? 'bg-pink-500 text-white'
                            : selectedA[Number(num)] === 'รอจับคู่ตะกร้า'
                              ? 'bg-orange-200 text-black'
                              : selectedA[Number(num)] === 'กำลังตรวจสอบ'
                                ? 'bg-blue-500 text-white'
                                : selectedA[Number(num)] === 'ยกเลิก'
                                  ? 'bg-red-500 text-white'
                                  : selectedA[Number(num)] === 'กำลังจัดยา'
                                    ? 'bg-orange-500 text-white'
                                    : 'border-gray-300'
                        }`}
                      onClick={() => Number(num) === 0 ? null : handleNumberClick(Number(num), 'A')}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && Number(num) !== 0) {
                          handleNumberClick(Number(num), 'A');
                        }
                      }}
                    >
                      <span className="block text-lg font-bold">
                        {Number(num) === 0 ? 'เริ่ม' : num}
                      </span>
                      {queueItem?.lastDispense && (
                        <span className="block text-xs text-gray-700">
                          เวลาจ่าย
                          {' '}
                          {TimeOnlyTH1(queueItem.lastDispense)}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                );
              }),
            )}
          </div>
        </Tab>


        <Tab key="B" title="B">
          <h2 className="mb-2 text-center text-lg">คิวรับยาปกติ A</h2>
          <div className="grid grid-cols-10 gap-2">
            {Queue1.map(row =>
              row.map((num) => {
                const normalizedNum = num.toString().padStart(3, '0');
                const queueItem = data?.find((item: any) => item.queue_code.replace(/^F/, '') === normalizedNum && item.queue_type === 'B');
                // console.log('num', num);
                // console.log('num0', normalizedNum);

                return (
                  <Tooltip
                    key={num}
                    content={
                      selectedB[Number(num)]
                        ? `หมายเลข ${num}: ${selectedB[Number(num)]}`
                        : ''
                    }
                    placement="top"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer rounded border p-2 text-center ${Number(num) === 0
                        ? 'bg-gray-300 text-black'
                        : selectedB[Number(num)] === 'จัดยาแล้ว'
                          ? selectedB[Number(num)] === 'แนบใบสั่ง'
                            ? 'border-pink-500 bg-green-500 text-white'
                            : 'bg-green-500 text-white'
                          : selectedB[Number(num)] === 'มีใบแนบ'
                            ? 'bg-pink-500 text-white'
                            : selectedB[Number(num)] === 'รอจับคู่ตะกร้า'
                              ? 'bg-orange-200 text-black'
                              : selectedB[Number(num)] === 'กำลังตรวจสอบ'
                                ? 'bg-blue-500 text-white'
                                : selectedB[Number(num)] === 'ยกเลิก'
                                  ? 'bg-red-500 text-white'
                                  : selectedB[Number(num)] === 'กำลังจัดยา'
                                    ? 'bg-orange-500 text-white'
                                    : 'border-gray-300'
                        }`}
                      onClick={() => Number(num) === 0 ? null : handleNumberClick(Number(num), 'B')}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && Number(num) !== 0) {
                          handleNumberClick(Number(num), 'B');
                        }
                      }}
                    >
                      <span className="block text-lg font-bold">
                        {Number(num) === 0 ? 'เริ่ม' : num}
                      </span>
                      {queueItem?.lastDispense && (
                        <span className="block text-xs text-gray-700">
                          เวลาจ่าย
                          {' '}
                          {TimeOnlyTH(queueItem.lastDispense)}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                );
              }),
            )}
          </div>
        </Tab>

        <Tab key="C" title="C">
          <h2 className="mb-2 text-center text-lg">คิวรับยาปกติ A</h2>
          <div className="grid grid-cols-10 gap-2">
            {Queue2.map(row =>
              row.map((num) => {
                const normalizedNum = num.toString().padStart(3, '0');
                const queueItem = data?.find((item: any) => item.queue_code === normalizedNum && item.queue_type === 'C');
                // console.log('num', num);
                // console.log('num0', normalizedNum);

                return (
                  <Tooltip
                    key={num}
                    content={
                      selectedC[Number(num)]
                        ? `หมายเลข ${num}: ${selectedC[Number(num)]}`
                        : ''
                    }
                    placement="top"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer rounded border p-2 text-center ${Number(num) === 0
                        ? 'bg-gray-300 text-black'
                        : selectedC[Number(num)] === 'จัดยาแล้ว'
                          ? selectedC[Number(num)] === 'แนบใบสั่ง'
                            ? 'border-pink-500 bg-green-500 text-white'
                            : 'bg-green-500 text-white'
                          : selectedC[Number(num)] === 'มีใบแนบ'
                            ? 'bg-pink-500 text-white'
                            : selectedC[Number(num)] === 'รอจับคู่ตะกร้า'
                              ? 'bg-orange-200 text-black'
                              : selectedC[Number(num)] === 'กำลังตรวจสอบ'
                                ? 'bg-blue-500 text-white'
                                : selectedC[Number(num)] === 'ยกเลิก'
                                  ? 'bg-red-500 text-white'
                                  : selectedC[Number(num)] === 'กำลังจัดยา'
                                    ? 'bg-orange-500 text-white'
                                    : 'border-gray-300'
                        }`}
                      onClick={() => Number(num) === 0 ? null : handleNumberClick(Number(num), 'C')}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && Number(num) !== 0) {
                          handleNumberClick(Number(num), 'C');
                        }
                      }}
                    >
                      <span className="block text-lg font-bold">
                        {Number(num) === 0 ? 'เริ่ม' : num}
                      </span>
                      {queueItem?.lastDispense && (
                        <span className="block text-xs text-gray-700">
                          เวลาจ่าย
                          {' '}
                          {TimeOnlyTH(queueItem.lastDispense)}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                );
              }),
            )}
          </div>
        </Tab>


        <Tab key="D" title="D">
          <h2 className="mb-2 text-center text-lg">คิวรับยาปกติ A</h2>
          <div className="grid grid-cols-10 gap-2">
            {Queue1.map(row =>
              row.map((num) => {
                const normalizedNum = num.toString().padStart(3, '0');
                const queueItem = data?.find((item: any) => item.queue_code.replace(/^F/, '') === normalizedNum && item.queue_type === 'D');
                // console.log('num', num);
                // console.log('num0', normalizedNum);

                return (
                  <Tooltip
                    key={num}
                    content={
                      selectedD[Number(num)]
                        ? `หมายเลข ${num}: ${selectedD[Number(num)]}`
                        : ''
                    }
                    placement="top"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer rounded border p-2 text-center ${Number(num) === 0
                        ? 'bg-gray-300 text-black'
                        : selectedD[Number(num)] === 'จัดยาแล้ว'
                          ? selectedD[Number(num)] === 'แนบใบสั่ง'
                            ? 'border-pink-500 bg-green-500 text-white'
                            : 'bg-green-500 text-white'
                          : selectedD[Number(num)] === 'มีใบแนบ'
                            ? 'bg-pink-500 text-white'
                            : selectedD[Number(num)] === 'รอจับคู่ตะกร้า'
                              ? 'bg-orange-200 text-black'
                              : selectedD[Number(num)] === 'กำลังตรวจสอบ'
                                ? 'bg-blue-500 text-white'
                                : selectedD[Number(num)] === 'ยกเลิก'
                                  ? 'bg-red-500 text-white'
                                  : selectedD[Number(num)] === 'กำลังจัดยา'
                                    ? 'bg-orange-500 text-white'
                                    : 'border-gray-300'
                        }`}
                      onClick={() => Number(num) === 0 ? null : handleNumberClick(Number(num), 'D')}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && Number(num) !== 0) {
                          handleNumberClick(Number(num), 'D');
                        }
                      }}
                    >
                      <span className="block text-lg font-bold">
                        {Number(num) === 0 ? 'เริ่ม' : num}
                      </span>
                      {queueItem?.lastDispense && (
                        <span className="block text-xs text-gray-700">
                          เวลาจ่าย
                          {' '}
                          {TimeOnlyTH(queueItem.lastDispense)}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                );
              }),
            )}
          </div>
        </Tab>
      </Tabs>




      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            เลือกสถานะสำหรับหมายเลข
            {currentSelectedNum?.toString().padStart(3, '0')}
          </ModalHeader>
          <ModalBody>
            {idEdit && (
              <div>
                <p>
                  HN :
                  {' '}
                  {idEdit.hnCode}
                </p>
                <p>
                  ชื่อ :
                  {' '}
                  {idEdit.full_name}
                </p>
                <p>
                  สถานะ :
                  {' '}
                  {idEdit.prescrip_status}
                </p>

                <p>
                  สิทธิ์การรักษา :
                  {' '}
                  {idEdit.pay_type}
                </p>
                <p>
                  ใบแนบ :
                  {' '}
                  {service || idEdit.medicine_service}
                </p>

                <p>
                  จ่ายยาเวลา :
                  {idEdit.lastDispense ? DateTimeLongTH(idEdit.lastDispense) : ' - '}
                </p>

              </div>
            )}
            {/* <div className="flex flex-col gap-2">
              <Button color="warning" onPress={handleupdate}>
                แนบใบสั่ง
              </Button>
              <Button color="danger" onPress={handleclear}>
                เคลียร์ใบแนบ
              </Button>
            </div> */}

            <div className="flex flex-col gap-2">
              {/* {idEdit?.medicine_service == 1 ? (
                <Button color="danger" onPress={handleclear}>
                  เคลียร์ใบแนบ
                </Button>
              ) : (
                <Button color="warning" onPress={handleupdate}>
                  แนบใบสั่ง
                </Button>
              )} */}
              {!(idEdit?.prescrip_status === "รอเรียกคิว" ||
                idEdit?.prescrip_status === "จ่ายยาสำเร็จ" ||
                idEdit?.prescrip_status === "ยกเลิก") && (
                  <div className="flex flex-col gap-2">
                    {idEdit?.medicine_service == 1 ? (
                      <Button color="danger" onPress={handleclear}>
                        เคลียร์ใบแนบ
                      </Button>
                    ) : (
                      <>
                        <Button color="warning" onPress={handleupdate}>
                          แนบใบสั่ง
                        </Button>
                        <Button color="danger" onPress={handleupdatestatus}>
                          ยกเลิกใบสั่งยา
                        </Button>
                      </>
                    )}
                  </div>
                )}


            </div>

          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainForm;
