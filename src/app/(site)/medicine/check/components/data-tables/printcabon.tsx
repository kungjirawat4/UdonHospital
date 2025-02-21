'use client';
import type { Row } from '@tanstack/react-table';
import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { useCallback, useEffect, useState } from 'react';
import { FaPrint } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import useToasts from '@/hooks/use-toasts';

type WithId = {
  id: string;
};

type PrintcProps<TData> = {
  row: Row<TData> | any;
};

export function PrintCProps<TData extends WithId>({ row }: PrintcProps<TData>) {
  // const drugId = row.id as string;

  // const pId = row.original.prescripId as string;
  const { toastSuccess, toastWarning } = useToasts();
  // const [prescriptionData, setPrescriptionData] = useState<any>(null);
  // console.log(row);
  // console.log(drugId);

  const handleConfirm = () => {
    try {
      const dataprint = row;
      // console.log(row);
      const dataToSend = {
        HN: `${dataprint?.hnCode}`,
        type_q: `${dataprint?.queue_type}`,
        q_dep: `${dataprint?.queue_code}`,
        pname: `${dataprint?.full_name}`,
        doctor: `${dataprint.doctor_names}`,
        pay: `${dataprint?.pay_type}`,
        lap: `${dataprint?.lap_name || ''}`,
        dept: `${dataprint?.dept_name || ''}`,
        allergy: `${dataprint?.drug_allergy || ''}`,
        item: dataprint?.arranged.map((arrange: any) => ({
          name: arrange?.medicine_name,
          quantity: arrange?.medicine_amount,
          med_details: arrange?.med_detail1,
          packsize: arrange?.medicinePackageSize,
          labelNo: arrange?.labelNo,
          dispcause: arrange?.dispcause || '', /// F
          medsts: arrange?.medsts || '', // 0 ยาใหม่
        })),

      };
      // console.log(dataToSend);
       axios.post('http://localhost:3000/v1/medicine/nodeprint', dataToSend)
      // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/nodeprint`, dataToSend)
      // toastSuccess('พิมพ์สำเร็จ');
        .then(async (response) => {
          console.log(response.status);
        // เช็คค่าผลลัพธ์จาก API ว่าการพิมพ์สำเร็จหรือไม่
          if (response.status === 200) {
          // หากสำเร็จ ส่งข้อความ success
            toastSuccess('พิมพ์สำเร็จ');
          } else {
          // หากไม่สำเร็จ ส่งคำขอพิมพ์ใหม่
          // console.log(response.data);
            toastWarning('เกิดข้อผิดพลาดในการพิมพ์');
          }
        });
    } catch (error) {
      console.error('Error confirming arrangement:', error);
      // toastWarning('เกิดข้อผิดพลาดในการพิมพ์');
    }
  };

  return (
    <div>
      {/* <Button onClick={handleConfirm} color="primary"> */}
      {/* <Button onClick={() => handleConfirm()} color="primary" className="ml-auto capitalize"> */}
      <Button onClick={() => handleConfirm()} color="primary" className="flex h-8 w-full min-w-32  gap-x-1 rounded-none bg-white px-2 text-sm text-black hover:bg-gray-200">
        {/* <FaPrint className="m-1" /> */}
        <FaPrint className="size-4 text-black" />
        ปริ้น cabon
      </Button>
    </div>
  );
}
