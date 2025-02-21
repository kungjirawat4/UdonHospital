import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { FaCheckToSlot } from 'react-icons/fa6';

import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';

type UpdateAllProps = {
  data: any[]; // ข้อมูลที่ส่งเข้ามาเป็น Array
  location: any;
};

const ConfrimAll: React.FC<UpdateAllProps> = ({ data, location }) => {
  const [datap, setDatap] = useState<any>(null);
  const updateApi = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;
  const fetchData = () => {
    fetch(`/api/medicine/prescription?q=${data}`)
      .then(res => res.json())
      .then((dataa) => {
        // console.log('Fetched data:', dataa);
        setDatap(dataa?.data[0]);
      });
  };
  useEffect(() => {
    fetchData(); // เรียก fetch ข้อมูลตอน mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // console.log(data);
  // console.log(datap?.arranged);
  // console.log(location);
  const { toastSuccess, toastWarning } = useToasts();
  const handleConfirmAll = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?.state?.userInfo?.id;
      // อัปเดตข้อมูลทั้งหมดพร้อมกัน
      await Promise.all(
        datap?.arranged
          .filter((item: { medicine: { cabinet: [{ storage_station: string }] } }) => item.medicine.cabinet[0]?.storage_station === location) // กรองเฉพาะรายการที่ตรงกับ location
          .map((item: { id: string }) =>
            updateApi?.mutate({
              id: item.id as string, // ใช้ ID ของแต่ละรายการ
              arrang_status: 'จัดยาแล้ว',
              user_arrang: userId,
              userId:userId,
              user_arrang_time: new Date().toISOString(),
            }),
          ),
      );

      toastSuccess('ยืนยันยาแล้ว');
      // ดึงข้อมูลใหม่หลังจากอัปเดตเสร็จ
      // getApi?.refetch();
    } catch (error) {
      console.error('Error confirming arrangement:', error);
      toastWarning('เกิดข้อผิดพลาดในการยืนยัน');
    }
  };

  return (
    <div>
      <Button onClick={handleConfirmAll} color="primary">
        <FaCheckToSlot className="m-1" />
        ยืนยันทั้งหมด
      </Button>

    </div>
  );
};

export default ConfrimAll;
