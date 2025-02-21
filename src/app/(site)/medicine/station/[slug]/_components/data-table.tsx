
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import {
  // Button,
  Input,
  // Popover,
  // PopoverContent,
  // PopoverTrigger,
} from '@nextui-org/react';
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useToasts from '@/hooks/use-toasts';
import useApi from '@/hooks/useApi';

import { columns } from './columnsDrug';
import PrintAll from './printall';
import UPDATEAll from './updataall';
import ApiCall from '@/services/api';

export function DataTable({ data }: any) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { toastSuccess, toastWarning, toastInfo } = useToasts();
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // console.log('data', data);

  // print
  const [printIndex] = useState(0); // เก็บ index ของข้อมูลที่กำลังปริ้น
  const inputRef = useRef<HTMLInputElement>(null);

  // ทำให้ช่องค้นหาถูกโฟกัสตลอดเวลา
  // useEffect(() => {
  //   const focusInput = () => {
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   };
  //   focusInput();
  //   document.addEventListener('click', focusInput);

  //   // Cleanup event listener เมื่อ component ถูก unmount
  //   return () => {
  //     document.removeEventListener('click', focusInput);
  //   };
  // }, []);
  useEffect(() => {
      const interval = setInterval(() => {
        inputRef.current?.focus(); // โฟกัสที่ช่อง Input ทุกๆ 3 วินาที
      }, 3000);
  
      // เคลียร์ interval เมื่อคอมโพเนนต์ถูก unmount
      return () => clearInterval(interval);
    }, []);

  const pId = data[printIndex]?.prescripId as string;
  const [datap, setDatap] = useState<any>(null);
  const fetchData = () => {
    fetch(`/api/medicine/prescription?q=${pId}`)
      .then(res => res.json())
      .then((dataa) => {
        // console.log('Fetched data:', dataa);
        setDatap(dataa?.data[0]);
      });
  };
  useEffect(() => {
    fetchData(); // เรียก fetch ข้อมูลตอน mount
  }, [pId]);
  const getApi = ApiCall({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription/station`,
  })?.get;
  const updateApi = ApiCall({
    key: ['arranged'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;
  // const updateApip = useApi({
  //   key: ['prescription'],
  //   method: 'PUT',
  //   url: `medicine/prescription`,
  // })?.put;

  const [inputValue, setInputValue] = useState('');
  let interval: any;
  // const checkArrangStatus = async () => {
  //   if (!datap?.arranged) {
  //     // console.log('ข้อมูลไม่ถูกต้องหรือไม่พบการจัดเรียง');
  //     return;
  //   }
  //   const id = datap.id;
  //   // เช็คว่าทุก arrangement มีสถานะ 'จัดยาแล้ว' หรือไม่
  //   const allArranged = data.every((arrangement: { arrang_status: any }) => {
  //     const { arrang_status } = arrangement;
  //     return arrang_status === 'จัดยาแล้ว' && arrang_status !== null && arrang_status !== '';
  //   });

  //   // ถ้าทุกสถานะเป็น 'จัดยาแล้ว'
  //   if (allArranged) {
  //     // console.log('ทุกสถานะจัดยาในข้อมูลที่จัดเรียงถูกต้อง');

  //     const updatePrescriptionData = {
  //       // prescrip_status: 'กำลังตรวจสอบ',
  //       station: true,
  //       queueStatus: 'กำลังตรวจสอบ',
  //     };

  //     // // อัปเดตข้อมูลที่นี่
  //     await Promise.all([
  //       updateApip?.mutateAsync({ id, ...updatePrescriptionData }),
  //       // เพิ่มการอัปเดตอื่น ๆ ที่นี่
  //     ]);
  //     router.push('/medicine/station');
  //   } else {
  //     // console.log('มีสถานะจัดยาไม่ตรงตามเงื่อนไขในข้อมูลที่จัดเรียง');
  //   }
  // };

  // useEffect(() => {
  //   checkArrangStatus(); // เรียกฟังก์ชันเช็คสถานะเมื่อ datap เปลี่ยน
  // }, [datap]); // ทำงานเมื่อ datap เปลี่ยนแปลง

  // useEffect(() => {
  //   // หน่วงเวลา 1 วินาทีให้ข้อมูลจาก API มีเวลาโหลด
  //   const timeout = setTimeout(() => {
  //     if (data && data.length === 0) {
  //       router.push('/medicine/station');
  //     }
  //   }, 3000); // หน่วงเวลา 1 วินาที

  //   return () => clearTimeout(timeout); // ล้าง timeout เมื่อคอมโพเนนต์ถูก unmount
  // }, [getApi?.data?.data, router, data]); // ใช้ getApi?.data?.data เป็น dependency

  useEffect(() => {
    if (data.length === 0) {
      interval = setInterval(() => {
        router.push('/medicine/station');
      }, 3000);
    }
    // Clearing the interval
    return () => clearInterval(interval);
  }, [router, data]);

  const handleCheckQRCode = async (inputValue: string) => {
    try {
      // const trimmedinputValue = inputValue.slice(1);
      // const matchedArrangements = data.filter(
      //   (arrangement: { medicine: { medicineCode: string } }) => arrangement.medicine.medicineCode === trimmedinputValue,
      // );
      const matchedArrangements = data.filter((arrangement: { barcode: string }) =>
        arrangement.barcode === inputValue,
      );

      if (matchedArrangements.length === 0) {
        toastWarning('ไม่พบข้อมูล');
        setInputValue('');
        return;
      }

      // console.log('ข้อมูลตรงกัน:', trimmedinputValue);

      await Promise.all(matchedArrangements.map(async (arrangement: any) => {
        // console.log('รายละเอียดของข้อมูลที่ตรงกัน:', arrangement.id);
        const { arrang_status } = arrangement;
        // ตรวจสอบว่าค่า arrang_status เป็น "จัดยาแล้ว"
        if (arrang_status === 'จัดยาแล้ว') {
          // toastInfo(`เช็คข้อมูล code (${trimmedinputValue}) ไปแล้ว`);
          toastInfo(`เช็คข้อมูล code (${arrangement.barcode}) ไปแล้ว`);
          return; // หยุดการทำงานสำหรับ ID นี้
        }
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userId = userInfo?.state?.userInfo?.id;
        const updateData = {
          arrang_status: 'จัดยาแล้ว',
          user_arrang: userId,
          userId:userId,
          user_arrang_time: new Date().toISOString()
        };

        const response = await updateApi?.mutateAsync({ ...updateData, id: arrangement.id });

        if (response) {
          toastSuccess('ยืนยันยาแล้ว');
          getApi?.refetch();
        } else {
          toastWarning('ไม่พบข้อมูล');
        }
      }));
      setInputValue('');
      fetchData(); // เรียก fetch ข้อมูลอีกครั้งเมื่อเช็ค QR code
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      // router.push('/medicine/station');
      toastWarning('เกิดข้อผิดพลาด');
    }
  };
  // console.log('dataraw', data);
  // console.log('data', getApi?.data?.data);
  // console.log('datalength', getApi?.data?.data.length);
  return (
    <div className="w-full">
      <div className="flex items-center py-2">

        <div className="ml-auto mt-2 flex w-auto flex-col capitalize">
          <Input
            // defaultValue={id}
            ref={inputRef}
            label="QR Code"
            size="sm"
            variant="bordered"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                handleCheckQRCode(inputValue); // เรียกใช้ฟังก์ชันที่แยกออกมา
              }
            }}
          />
        </div>
        {/* <div className="ml-auto capitalize">
          <PrintAll data={data} datap={datap} />

        </div> */}
        <div className="ml-auto flex items-center justify-end space-x-4 capitalize">
          <PrintAll data={data} datap={datap} />
          <UPDATEAll data={data} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild />
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value =>
                      column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-y-scroll lg:max-h-[150px] xl:max-h-[250px] 2xl:max-h-[500px]">
        <Table className="text-xs ">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="text-lg">
            {table.getRowModel().rows?.length
              ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="p-1">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
              : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
