

'use client';

import type { Row } from '@tanstack/react-table';
// import { useRouter } from 'next/navigation';
// import { useCallback, useEffect, useState } from 'react';
import { FaCheckToSlot } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';


type WithId = {
  id: string;
};

type ConfirmProps<TData> = {
  row: Row<TData> | any;
};

export function Confirm<TData extends WithId>({ row }: ConfirmProps<TData>) {
  const drugId = row.original.id as string;
  // const pId = row.original.prescripId as string;
  const { toastSuccess, toastWarning } = useToasts();
  // const [prescriptionData, setPrescriptionData] = useState<any>(null);

  const getApi = ApiCall({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription/station`,
  })?.get;

  const updateArrangementApi = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;

  // const updatePrescriptionApi = useApi({
  //   key: ['prescription'],
  //   method: 'PUT',
  //   url: `medicine/prescription`,
  // })?.put;

  // const router = useRouter();

  // Fetch prescription data based on prescription ID
  // useEffect(() => {
  //   const fetchPrescriptionData = async () => {
  //     try {
  //       const response = await fetch(`/api/medicine/prescription?q=${pId}`);
  //       const data = await response.json();
  //       setPrescriptionData(data?.data?.[0] || null);
  //     } catch (error) {
  //       console.error('Error fetching prescription data:', error);
  //     }
  //   };

  //   if (pId) {
  //     fetchPrescriptionData();
  //   }
  // }, [pId]);
  // console.log('prescriptionData', prescriptionData?.arranged);
  // const checkArrangementStatus = useCallback(async () => {
  //   if (!prescriptionData?.arranged) {
  //     // toastWarning('ไม่พบข้อมูลการจัดเรียง');
  //     return;
  //   }

  //   const { arranged, id } = prescriptionData;

  //   const allArrangedCorrectly = arranged.every(
  //     (arrangement: { arrang_status: string }) =>
  //       arrangement.arrang_status === 'กำลังจัดยา',
  //   );

  //   if (allArrangedCorrectly) {
  //     const updateData = {
  //       station: true,
  //       queueStatus: 'กำลังตรวจสอบ',
  //     };

  //     try {
  //       await updatePrescriptionApi?.mutateAsync({ id, ...updateData });
  //       toastSuccess('สถานะอัปเดตสำเร็จ');
  //       router.push('/medicine/station');
  //     } catch (error) {
  //       console.error('Error updating prescription:', error);
  //       toastWarning('เกิดข้อผิดพลาดในการอัปเดต');
  //     }
  //   } else {
  //     // toastWarning('มีข้อมูลที่ยังไม่จัดยา');
  //   }
  // }, [prescriptionData, updatePrescriptionApi, router, toastSuccess, toastWarning]);

  const handleConfirm = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?.state?.userInfo?.id;
    const updateData = {
      arrang_status: 'จัดยาแล้ว',
      user_arrang: userId,
      userId:userId,
      user_arrang_time: new Date().toISOString(),
    };

    try {
      const response = updateArrangementApi?.mutate({
        id: drugId,
        ...updateData,
      });

      // if (response) {
        toastSuccess('ยืนยันยาแล้ว');
        // await checkArrangementStatus();
        getApi?.refetch();
      // } else {
      //   toastWarning('ไม่พบข้อมูล');
      // }
    } catch (error) {
      console.error('Error confirming arrangement:', error);
      toastWarning('เกิดข้อผิดพลาดในการยืนยัน');
    }
  };

  return (
    <div>
      <Button onClick={handleConfirm} color="primary">
        <FaCheckToSlot className="m-1" />
        ยืนยัน
      </Button>
    </div>
  );
}
