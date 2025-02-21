'use client';

// import { Checkbox } from '@nextui-org/react';
import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { TfiClose } from 'react-icons/tfi';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import ImagePopup from './ImageDialog';

export const columns: ColumnDef<any>[] = [
  {
    id: 'no',
    header: 'No.',
    // with: 50,
    cell: ({ row }: any) => <div>{Number(row.id) + 1}</div>,
  },
  {
    accessorKey: 'medicineCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="รหัสยา" />
    ),
    cell: ({ row }) => {
      // ตรวจสอบว่า 'medicineCode' มีค่าหรือไม่ ถ้าไม่มีให้ใช้ 'medicine.medicineCode'
      const medicineCode = row.getValue('medicineCode') || row.original.medicine?.medicineCode;
      return <div className="capitalize">{medicineCode}</div>;
    },
  },
  {
    accessorKey: 'HouseId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="บ้านยา" />
    ),
    cell: ({ row }) => {
      // ตรวจสอบว่า 'medicineCode' มีค่าหรือไม่ ถ้าไม่มีให้ใช้ 'medicine.medicineCode'
      const HouseId = row.original.medicine?.cabinet[0]?.HouseId;
      return <div className="capitalize">{HouseId}</div>;
    },
  },
  // {
  //   id: 'select-col',
  //   header: 'Check',
  //   accessorKey: 'user_check_time',
  //   cell: ({ row }) => {
  //     const userCheckTime = row.original.user_check_time; // ดึงค่า user_check_time

  //     return (
  //       <Checkbox
  //         isSelected={!!userCheckTime} // ใช้ isSelected แทน checked
  //         isDisabled // ปิดการแก้ไขค่า
  //       >
  //       </Checkbox>
  //     );
  //   },
  // },

  {
    id: 'medicineGenericName',
    accessorKey: 'medicine.medicineGenericName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ชื่อสามัญทางยา" />
    ),
    filterFn: 'includesString',
    cell: ({ row }) => {
      const name = row?.original?.medicine?.name as string || row?.original?.medicine_name as string;
      const image = row?.original?.medicine?.medicineImage1 as string;
      const size = row?.original?.medicine?.medicinePackageSize as string || row?.original?.medicinePackageSize as string;

      return (
        <div className="flex items-center space-x-2">
          {image
            ? (
                <ImagePopup imageSrc={image} altText="" />
              )
            : (
                <div className="flex items-center space-x-1 text-gray-500">
                  <TfiClose className="text-red-500" />
                  <span>No image</span>
                </div>
              )}
          <div className="capitalize">
            {name}
            {' '}
            {size}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'medicine_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="จำนวน" />
    ),
    cell: ({ row }) => {
      const medicineAmount = row.getValue('medicine_amount');
      const medicinePackageSize = row.original.medicinePackageSize; // ใช้ข้อมูลจาก row.original
      return (
        <div className="capitalize">
          {medicineAmount}
          {' '}
          {medicinePackageSize}
        </div>
      );
    },
  },
  {
    id: 'labelNo',
    accessorKey: 'labelNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="labelNo" />
    ),
    cell: ({ row }) => {
      // ตรวจสอบว่า 'medicineCode' มีค่าหรือไม่ ถ้าไม่มีให้ใช้ 'medicine.medicineCode'
      const labelNo = row.original.labelNo;
      return <div className="capitalize">{labelNo}</div>;
    },
  },
  // {
  //   accessorKey: 'med_detail',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="วิธีใช้" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue('med_detail')}</div>
  //   ),
  // },
  // {
  //   accessorKey: 'medicine_advice',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="คำแนะนำ" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue('medicine_advice')}</div>
  //   ),
  // },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="การกระทำ" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <DataTableRowActions row={row} />
      </div>
    ),
  },
];
