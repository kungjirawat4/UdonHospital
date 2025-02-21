// 'use client';

// import type { Row } from '@tanstack/react-table';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { FaCheckToSlot } from 'react-icons/fa6';

// import { Button } from '@/components/ui/button';
// import useToasts from '@/hooks/use-toast';
// import useApi from '@/hooks/useApi';

// type WithId = {
//   id: string;
// };
// type ConfirmProps<TData> = {
//   row: Row<TData> | any;
// };

// export function Confirm<TData extends WithId>({
//   row,
// }: ConfirmProps<TData>) {
//   const drugId = row.original.id as string;
//   const pId = row.original.prescripId as string;
//   const { toastSuccess, toastWarning } = useToasts();
//   const [datap, setDatap] = useState<any>(null);
//   const getApi = useApi({
//     key: ['prescription'],
//     method: 'GET',
//     url: `medicine/prescription/station`,
//   })?.get;
//   const updateApi = useApi({
//     key: ['prescription'],
//     method: 'PUT',
//     url: `medicine/prescription/arranged`,
//   })?.put;
//   const updateApip = useApi({
//     key: ['prescription'],
//     method: 'PUT',
//     url: `medicine/prescription`,
//   })?.put;
//   useEffect(() => {
//     fetch(`/api/medicine/prescription?q=${pId}`)
//       .then(res => res.json())
//       .then((data) => {
//         setDatap(data?.data[0]);
//         // setLoading(false);
//       });
//   }, [pId]);
//   const router = useRouter();
//   const checkArrangStatus = async () => {
//     if (!datap?.arranged) {
//       // console.log('ข้อมูลไม่ถูกต้องหรือไม่พบการจัดเรียง');
//       return;
//     }
//     const id = datap.id;
//     // เช็คว่าทุก arrangement มีสถานะ 'จัดยาแล้ว' หรือไม่
//     const allArranged = datap?.arranged.every((arrangement: { arrang_status: any }) => {
//       const { arrang_status } = arrangement;
//       return arrang_status === 'จัดยาแล้ว' && arrang_status !== null && arrang_status !== '';
//     });

//     // ถ้าทุกสถานะเป็น 'จัดยาแล้ว'
//     if (allArranged) {
//       // console.log('ทุกสถานะจัดยาในข้อมูลที่จัดเรียงถูกต้อง');

//       const updatePrescriptionData = {
//         // prescrip_status: 'กำลังตรวจสอบ',
//         station: true,
//         queueStatus: 'กำลังตรวจสอบ',
//       };

//       // // อัปเดตข้อมูลที่นี่
//       await Promise.all([
//         updateApip?.mutateAsync({ id, ...updatePrescriptionData }),
//         // เพิ่มการอัปเดตอื่น ๆ ที่นี่
//       ]);
//       router.push('/medicine/station');
//     } else {
//       // console.log('มีสถานะจัดยาไม่ตรงตามเงื่อนไขในข้อมูลที่จัดเรียง');
//     }
//   };
//   const handleConfirm = async () => {
//     try {
//       // console.log('ข้อมูลตรงกัน:', trimmedinputValue);

//       const updateData = { arrang_status: 'จัดยาแล้ว', user_arrang_time: new Date().toISOString() };

//       const response = await updateApi?.mutateAsync({ ...updateData, id: drugId });

//       if (response) {
//         toastSuccess('ยืนยันยาแล้ว');
//         await checkArrangStatus();
//         getApi?.refetch();
//       } else {
//         toastWarning('ไม่พบข้อมูล');
//       };
//     // eslint-disable-next-line unused-imports/no-unused-vars
//     } catch (error) {
//       // router.push('/medicine/station');
//       toastWarning('เกิดข้อผิดพลาดในการอัพเดท');
//     }
//   };

//   return (
//     <div>
//       <Button onClick={handleConfirm} color="primary">
//         <FaCheckToSlot className="m-1" />
//         {' '}
//         ConFirm
//       </Button>
//     </div>
//   );
// }

'use client';

import type { Row } from '@tanstack/react-table';
// import { useRouter } from 'next/navigation';
// import { useCallback, useEffect, useState } from 'react';
import { FaRightLeft } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import useToasts from '@/hooks/use-toasts';
import useApi from '@/hooks/useApi';

type WithId = {
  id: string;
};

type StatusProps<TData> = {
  row: Row<TData> | any;
};

export function Status<TData extends WithId>({ row }: StatusProps<TData>) {
  const drugId = row.id as string;
  // const pId = row.original.prescripId as string;
  const { toastSuccess, toastWarning } = useToasts();
  // const [prescriptionData, setPrescriptionData] = useState<any>(null);
  // console.log(row);
  // console.log(drugId);
  const getApi = useApi({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription/doublecheck`,
  })?.get;

  const updateApi = useApi({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription`,
  })?.put;

  const handleConfirm = async () => {
    const updateData = {
      station: true,
      queueStatus: 'กำลังตรวจสอบ',
    };

    try {
      const response = await updateApi?.mutateAsync({
        id: drugId,
        ...updateData,
      });

      if (response) {
        toastSuccess('เปลี่ยนสถานะสำเร็จ');
        // await checkArrangementStatus();
        getApi?.refetch();
      } else {
        toastWarning('ไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Error confirming arrangement:', error);
      toastWarning('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }
  };

  return (
    <div>
      <Button onClick={handleConfirm} color="primary">
        <FaRightLeft className="m-1" />
        สถานะ
      </Button>
    </div>
  );
}
