'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, Tooltip } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

import { TopLoadingBar } from '@/components/common/TopLoadingBar';
import useApi from '@/hooks/useApi';

const MainForm = () => {
  const [selectedF, setSelectedF] = useState<{ [key: number]: string }>({});
  const [selectedA, setSelectedA] = useState<{ [key: number]: string }>({});
  const [selectedAA, setSelectedAA] = useState<{ [key: number]: string }>({});
  const [selectedCC, setSelectedCC] = useState<{ [key: number]: string }>({});
  const [selectedB, setSelectedB] = useState<{ [key: number]: string }>({});
  const [selectedC, setSelectedC] = useState<{ [key: number]: string }>({});
  const [selectedD, setSelectedD] = useState<{ [key: number]: string }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSelectedNum, setCurrentSelectedNum] = useState<number | null>(null);
  const [currentSide, setCurrentSide] = useState<'F' | 'A' | 'B' | 'C' | 'D' | null>(null);
  const getApi = useApi({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription`,
  })?.get;
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
    const updatedF = { ...selectedF };
    const updatedA = { ...selectedA };
    const updatedB = { ...selectedB };
    const updatedC = { ...selectedC };
    const updatedD = { ...selectedD };

    data?.forEach((item: { queue_code: any; prescrip_status: string; queue_type: string }) => {
      if (item.queue_code.startsWith('F')) {
        // สำหรับฝั่งซ้าย (F)
        if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
          updatedF[item.queue_code] = 'จัดยาแล้ว';
        } else if (item.prescrip_status === 'รอจับคู่ตะกร้า') {
          updatedF[item.queue_code] = 'รอจับคู่ตะกร้า';
        }
      } else {
        if (item.queue_type === 'A') {
          const normalizedCode = item.queue_code.replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
          if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
            updatedA[normalizedCode] = 'จัดยาแล้ว';
          } else if (item.prescrip_status === 'รอจับคู่ตะกร้า' || item.prescrip_status === 'กำลังจัดยา' || item.prescrip_status === 'กำลังตรวจสอบ') {
            updatedA[normalizedCode] = 'รอจับคู่ตะกร้า';
          }
        } else if (item.queue_type === 'B') {
          const normalizedCode = item.queue_code.replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
          if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
            updatedB[normalizedCode] = 'จัดยาแล้ว';
          } else if (item.prescrip_status === 'รอจับคู่ตะกร้า' || item.prescrip_status === 'กำลังจัดยา' || item.prescrip_status === 'กำลังตรวจสอบ') {
            updatedB[normalizedCode] = 'รอจับคู่ตะกร้า';
          }
        } else if (item.queue_type === 'C') {
          const normalizedCode = item.queue_code.replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
          if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
            updatedC[normalizedCode] = 'จัดยาแล้ว';
          } else if (item.prescrip_status === 'รอจับคู่ตะกร้า' || item.prescrip_status === 'กำลังจัดยา' || item.prescrip_status === 'กำลังตรวจสอบ') {
            updatedC[normalizedCode] = 'รอจับคู่ตะกร้า';
          }
        } else if (item.queue_type === 'D') {
          const normalizedCode = item.queue_code.replace(/^0+/, ''); // ลบเลข 0 ที่อยู่หน้าสุด
          if (item.prescrip_status === 'รอเรียกคิว' || item.prescrip_status === 'จ่ายยาสำเร็จ') {
            updatedD[normalizedCode] = 'จัดยาแล้ว';
          } else if (item.prescrip_status === 'รอจับคู่ตะกร้า' || item.prescrip_status === 'กำลังจัดยา' || item.prescrip_status === 'กำลังตรวจสอบ') {
            updatedD[normalizedCode] = 'รอจับคู่ตะกร้า';
          }
        }
      }
    });

    setSelectedF(updatedF);
    setSelectedA(updatedA);
    setSelectedB(updatedB);
    setSelectedC(updatedC);
    setSelectedD(updatedD);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ฟังก์ชันจัดการ Local Storage
  const updateLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleNumberClick = (num: number, side: 'F' | 'A' | 'B' | 'C' | 'D') => {
    setCurrentSelectedNum(num);
    setCurrentSide(side);
    setIsModalOpen(true);
  };
  const handleStatusChange = (status: string) => {
    if (currentSelectedNum !== null && currentSide) {
      if (currentSide === 'F') {
        setSelectedF((prev) => {
          const updated = { ...prev, [currentSelectedNum]: status };
          updateLocalStorage('selectedF', updated);
          return updated;
        });
      } else if (currentSide === 'A') {
        setSelectedA((prev) => {
          const updated = { ...prev, [currentSelectedNum]: status };
          updateLocalStorage('selectedA', updated);
          return updated;
        });
      } else if (currentSide === 'B') {
        setSelectedB((prev) => {
          const updated = { ...prev, [currentSelectedNum]: status };
          updateLocalStorage('selectedB', updated);
          return updated;
        });
      } else if (currentSide === 'C') {
        setSelectedC((prev) => {
          const updated = { ...prev, [currentSelectedNum]: status };
          updateLocalStorage('selectedC', updated);
          return updated;
        });
      } else if (currentSide === 'D') {
        setSelectedD((prev) => {
          const updated = { ...prev, [currentSelectedNum]: status };
          updateLocalStorage('selectedD', updated);
          return updated;
        });
      }
      setIsModalOpen(false);
      setCurrentSelectedNum(null);
      setCurrentSide(null);
    }
  };
  // console.log(currentSide);
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

  const [currentDate, setCurrentDate] = useState<string>('');

  // ฟังก์ชันในการแปลงวันที่ให้เป็นแบบไทย
  const getThaiDate = () => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const now = new Date();
    const dayOfWeek = days[now.getDay()];
    const dayOfMonth = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear() + 543; // ปีพุทธศักราช

    return `วัน${dayOfWeek} ที่ ${dayOfMonth} ${month} ${year}`;
  };

  useEffect(() => {
    const today = getThaiDate();
    setCurrentDate(today);

    const storedDate = localStorage.getItem('currentDate');
    const savedF = localStorage.getItem('selectedF');
    const savedA = localStorage.getItem('selectedA');
    const savedB = localStorage.getItem('selectedB');
    const savedC = localStorage.getItem('selectedC');
    const savedD = localStorage.getItem('selectedD');

    // เช็คว่า วันที่ใน localStorage กับวันนี้ตรงกันหรือไม่ ถ้าไม่ตรงให้ล้างค่าใน localStorage
    if (storedDate !== today) {
      localStorage.removeItem('selectedF');
      localStorage.removeItem('selectedA');
      localStorage.removeItem('selectedB');
      localStorage.removeItem('selectedC');
      localStorage.removeItem('selectedD');
      localStorage.setItem('currentDate', today); // เก็บค่า new currentDate
      window.location.reload();
    }

    // หากมีข้อมูลใน localStorage ให้โหลดมา
    if (savedF) {
      setSelectedF(JSON.parse(savedF));
    }
    if (savedA) {
      setSelectedA(JSON.parse(savedA));
      setSelectedAA(JSON.parse(savedA));
    }
    if (savedB) {
      setSelectedB(JSON.parse(savedB));
    }
    if (savedC) {
      setSelectedC(JSON.parse(savedC));
      setSelectedCC(JSON.parse(savedC));
    }
    if (savedD) {
      setSelectedD(JSON.parse(savedD));
    }

    // เก็บ currentDate ใน localStorage
    localStorage.setItem('currentDate', today);
  }, [currentDate]); // useEffect จะทำงานทุกครั้งที่ currentDate เปลี่ยน

  // const handleClearStatus = () => {
  //   if (currentSelectedNum !== null && currentSide) {
  //     if (currentSide === 'F') {
  //       setSelectedF((prev) => {
  //         const updated = { ...prev };
  //         delete updated[currentSelectedNum]; // ลบค่าออก
  //         updateLocalStorage('selectedF', updated);
  //         return updated;
  //       });
  //     } else if (currentSide === 'A') {
  //       setSelectedA((prev) => {
  //         const updated = { ...prev };
  //         delete updated[currentSelectedNum]; // ลบค่าออก
  //         updateLocalStorage('selectedA', updated);
  //         return updated;
  //       });
  //     } else if (currentSide === 'B') {
  //       setSelectedB((prev) => {
  //         const updated = { ...prev };
  //         delete updated[currentSelectedNum]; // ลบค่าออก
  //         updateLocalStorage('selectedB', updated);
  //         return updated;
  //       });
  //     } else if (currentSide === 'C') {
  //       setSelectedC((prev) => {
  //         const updated = { ...prev };
  //         delete updated[currentSelectedNum]; // ลบค่าออก
  //         updateLocalStorage('selectedC', updated);
  //         return updated;
  //       });
  //     } else if (currentSide === 'D') {
  //       setSelectedD((prev) => {
  //         const updated = { ...prev };
  //         delete updated[currentSelectedNum]; // ลบค่าออก
  //         updateLocalStorage('selectedD', updated);
  //         return updated;
  //       });
  //     }
  //     setIsModalOpen(false);
  //     setCurrentSelectedNum(null);
  //     setCurrentSide(null);
  //   }
  // };
  return (

    <div>
      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />
      {/* <Tabs
        value={selectedTab}
        onChange={setSelectedTab}
        aria-label="Queue Type Tabs"
      > */}
      <Tabs
        color="danger"

        className="w-full"
        aria-label="Queue Type Tabs"
      >
        <Tab key="A" title="A">
          <h2 className="mb-2 text-center text-lg">คิวรับยาปกติ A</h2>
          <div className="grid grid-cols-10 gap-2">
            {Queue2.map(row =>
              row.map(num => (
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
                    className={`cursor-pointer rounded border p-2 text-center ${
                      Number(num) === 0
                        ? 'bg-gray-300 text-black'
                        : selectedA[Number(num)] === 'จัดยาแล้ว'
                          ? selectedAA[Number(num)] === 'แนบใบสั่ง'
                            ? 'border-orange-500 bg-green-500 text-white'
                            : 'bg-green-500 text-white'
                          : selectedA[Number(num)] === 'แนบใบสั่ง'
                            ? 'bg-orange-500 text-white'
                            : selectedA[Number(num)] === 'รอจับคู่ตะกร้า'
                              ? 'bg-orange-200 text-black'
                              : selectedA[Number(num)] === 'ยกเลิก'
                                ? 'bg-red-500 text-white'
                                : 'border-gray-300'
                    }`}
                    onClick={() => Number(num) === 0 ? null : handleNumberClick(Number(num), 'A')} // กดไม่ได้ถ้าเป็นหมายเลข 0
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && Number(num) !== 0) {
                        handleNumberClick(Number(num), 'A');
                      }
                    }}
                  >
                    {Number(num) === 0 ? 'เริ่ม' : num}
                  </div>

                </Tooltip>
              )),
            )}
          </div>
        </Tab>
        <Tab key="B" title="B">
          <h2 className="mb-2 text-center text-lg">คิวรับยาด่วน F (B)</h2>
          <div className="grid grid-cols-5 gap-2">
            {Queue1.map(row =>
              row.map(num => (
                <Tooltip
                  key={num}
                  content={
                    selectedF[Number(num)]
                      ? `หมายเลข ${num}: ${selectedF[Number(num)]}`
                      : ''
                  }
                  placement="top"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer rounded border p-2 text-center ${
                      selectedF[Number(num)] === 'จัดยาแล้ว'
                        ? 'bg-green-500 text-white'
                        : selectedF[Number(num)] === 'แนบใบสั่ง'
                          ? 'bg-orange-500 text-white'
                          : selectedF[Number(num)] === 'รอจับคู่ตะกร้า'
                            ? 'bg-orange-200 text-white'
                            : selectedF[Number(num)] === 'ยกเลิก'
                              ? 'bg-red-500 text-white'
                              : 'border-gray-300'
                    }`}
                    onClick={() => handleNumberClick(Number(num), 'F')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleNumberClick(Number(num), 'F');
                      }
                    }}
                  >
                    {num}
                  </div>

                </Tooltip>
              )),
            )}
          </div>
        </Tab>

        <Tab key="C" title="C">
          <h2 className="mb-2 text-center text-lg">คิวรับยาปกติ C</h2>
          <div className="grid grid-cols-10 gap-2">
            {Queue2.map(row =>
              row.map(num => (
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
                    className={`cursor-pointer rounded border p-2 text-center ${
                      Number(num) === 0
                        ? 'bg-gray-300 text-black'
                        : selectedC[Number(num)] === 'จัดยาแล้ว'
                          ? selectedCC[Number(num)] === 'แนบใบสั่ง'
                            ? 'border-orange-500 bg-green-500 text-white'
                            : 'bg-green-500 text-white'
                          : selectedC[Number(num)] === 'แนบใบสั่ง'
                            ? 'bg-orange-500 text-white'
                            : selectedC[Number(num)] === 'รอจับคู่ตะกร้า'
                              ? 'bg-orange-200 text-black'
                              : selectedC[Number(num)] === 'ยกเลิก'
                                ? 'bg-red-500 text-white'

                                : 'border-gray-300'
                    }`}
                    onClick={() => Number(num) === 0 ? null : handleNumberClick(Number(num), 'C')} // กดไม่ได้ถ้าเป็นหมายเลข 0
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && Number(num) !== 0) {
                        handleNumberClick(Number(num), 'C');
                      }
                    }}
                  >
                    {Number(num) === 0 ? 'เริ่ม' : num}
                  </div>

                </Tooltip>
              )),
            )}
          </div>
        </Tab>

        <Tab key="D" title="D">
          <h2 className="mb-2 text-center text-lg">คิวรับยาด่วน D</h2>
          <div className="grid grid-cols-5 gap-2">
            {Queue1.map(row =>
              row.map(num => (
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
                    className={`cursor-pointer rounded border p-2 text-center ${
                      selectedD[Number(num)] === 'จัดยาแล้ว'
                        ? 'bg-green-500 text-white'
                        : selectedD[Number(num)] === 'แนบใบสั่ง'
                          ? 'bg-orange-500 text-white'
                          : selectedD[Number(num)] === 'รอจับคู่ตะกร้า'
                            ? 'bg-orange-200 text-white'
                            : selectedD[Number(num)] === 'ยกเลิก'
                              ? 'bg-red-500 text-white'
                              : 'border-gray-300'
                    }`}
                    onClick={() => handleNumberClick(Number(num), 'D')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleNumberClick(Number(num), 'D');
                      }
                    }}
                  >
                    {num}
                  </div>

                </Tooltip>
              )),
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            เลือกสถานะสำหรับหมายเลข
            {currentSelectedNum}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              {/* <Button onPress={() => handleStatusChange('รอจับคู่ตะกร้า')} className="bg-orange-200">
                รอจับคู่ตะกร้า
              </Button> */}
              <Button onPress={() => handleStatusChange('จัดยาแล้ว')} color="success">
                จัดยาแล้ว
              </Button>
              <Button onPress={() => handleStatusChange('แนบใบสั่ง')} color="warning">
                แนบใบสั่ง
              </Button>
              <Button onPress={() => handleStatusChange('ยกเลิก')} color="danger">
                ยกเลิก
              </Button>
              {/* <Button
                onPress={handleClearStatus}
              >
                เคลียร์ค่า
              </Button> */}
            </div>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MainForm;
