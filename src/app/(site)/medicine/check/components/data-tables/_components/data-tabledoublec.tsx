/* eslint-disable style/multiline-ternary */
'use client';

import {
  Button, Spinner,
  // , Spinner
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
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { FaCheckDouble, FaNotesMedical } from 'react-icons/fa6';
import { GrPowerReset } from 'react-icons/gr';

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
// import useApi from '@/hooks/useApi';

import { columns } from './columnsDrug';
import AddForm from './forms/add-form-drug';
import { ResponsiveDialog } from './responsive-dialog';
import Search from './Search';
import ApiCall from '@/services/api';

export function DataTable({ data, add }: any) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isPostOpen, setIsPostOpen] = useState(false);
  const { toastWarning, toastSuccess } = useToasts();
  const [q, setQ] = useState('');
  const [tableData, setTableData] = useState(data); // สถานะสำหรับข้อมูลตาราง
  const [isLoading, setIsLoading] = useState(false);
  const table = useReactTable({
    data: tableData,
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
    initialState: {
      pagination: { pageSize: 100 }, // กำหนดให้แสดง 20 แถวต่อหน้า
    },
  });
  const updateApi = ApiCall({
    key: ['arranged'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;
  const updateApip = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription`,
  })?.put;

  const [prescripid, setprescripid] = useState<any>(null);

  const [Datam, setData] = useState<any>(null);
  // console.log('data', data);
  const check = data;
  // console.log('check', check);
  useEffect(() => {
    if (data && data.length > 0) {
      const iddatap = data[0].prescripId;
      setprescripid(iddatap);
      setData(data.length);
      // console.log(iddatap);
    }
  }, [data]);

  // const findMatchingData = (query: string, datacheck: any[]) => {
  //   const searchInObject = (obj: any): boolean => {
  //     return Object.values(obj).some((value) => {
  //       if (typeof value === 'string') {
  //         return value === query; // ใช้ === เพื่อให้ตรงกันทั้งหมด
  //       }
  //       if (typeof value === 'object' && value !== null) {
  //         return searchInObject(value); // ค้นหาใน object ที่ซ้อนกัน
  //       }
  //       return false;
  //     });
  //   };

  //   return datacheck.filter(item => searchInObject(item));
  // };
  const findMatchingData = (query: string, datacheck: any[]) => {
    const searchInObject = (obj: any): boolean => {
      return Object.values(obj).some((value) => {
        if (typeof value === 'string') {
          return value === query; // ใช้ === เพื่อให้ตรงทั้งหมด
        }
        if (typeof value === 'object' && value !== null) {
          return searchInObject(value); // ค้นหาใน object ที่ซ้อนกัน
        }
        return false;
      });
    };

    // กรองข้อมูลที่ user_check_time === null และค้นหาตาม query
    return datacheck.filter(
      item => item.user_check_time === null && searchInObject(item),
    );
  };

  const handleReset = useCallback(async () => {
    try {
      const response = await fetch('/api/medicine/prescription/arranged');
      const datar = await response.json();
      const datareset = datar.data;

      const matchingdatareset = datareset.filter(
        (item: any) => item.prescripId === prescripid,
      );
      if (matchingdatareset.length > 0) {
        setTableData(matchingdatareset);
        setData(matchingdatareset.length);
        setIsLoading(false);
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      // console.error('API Error:', error);
      // toastWarning('เกิดข้อผิดพลาดไม่สามารถดึงข้อมูลได้');
    }
  }, [prescripid]);
  // console.log('data', prescripIds);
  const checkall = async () => {
    setIsLoading(true); // เริ่มต้น Loading
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?.state?.userInfo?.id; // ถ้าไม่มีค่า id ให้เป็น null
    const updateDatacheck = {
      user_check_time: new Date().toISOString(),
      user_double_check: userId

    };
    const updateprescrip = {
      checkTime: new Date().toISOString(),
      userDoubleCheck: userId,
      userId: userId

    };
    // console.log(userId);
    try {
      // เรียก API เพื่ออัปเดตข้อมูลโดยใช้ id ที่ได้
      // data.forEach((item: { id: string }) => {
      //   updateApi?.mutate({
      //     id: item.id as string, // ใช้ id ของแต่ละรายการที่พิมพ์
      //     ...updateDatacheck,
      //   });
      // });
      const uncheckedData = data.filter((item: any) => item.user_check_time === null);
      const uncheckedtableData = tableData.filter((item: any) => item.user_check_time === null);
      // ตรวจสอบว่ามีข้อมูลที่ยังไม่ได้ยืนยันหรือไม่
      if (uncheckedData.length > 0 && uncheckedtableData.length > 0) {
        for (const item of uncheckedData && uncheckedtableData) {
          await updateApi?.mutateAsync({
            id: item.id as string, // อัปเดตข้อมูลโดยใช้ id ของแต่ละรายการ
            ...updateDatacheck,
          });
          // console.log(item.prescripId)
          await updateApip?.mutateAsync({
            id: item.prescripId as string, // อัปเดตข้อมูลโดยใช้ id ของแต่ละรายการ
            ...updateprescrip,
          });
        }

        toastSuccess('ยืนยันทั้งหมดสำเร็จ');
        handleReset();
      } else {
        // setIsLoading(false);
        toastWarning('ยืนยันทั้งหมดไปแล้ว'); // ไม่มีข้อมูลที่ยังไม่ได้ยืนยัน
      }

      // console.log(`Updated data for prescription ID: ${id}`);
    } catch (error) {
      console.error(`Failed to update prescription ID: `, error);
      toastWarning('เกิดข้อผิดพลาด');
    }
    finally {
      setIsLoading(false); // หยุด Loading ในทุกกรณี
    }
  };

  useEffect(() => {
    if (!isPostOpen) {
      const timer = setTimeout(() => {
        handleReset();
      }, 500); // ดีเลย์ 1000 มิลลิวินาที (1 วินาที)

      return () => {
        clearTimeout(timer); // เคลียร์ timer เมื่อ component ถูก unmount หรือ effect ถูกเรียกใหม่
      };
    }

    // Explicitly returning undefined to satisfy TypeScript
    return undefined;
  }, [isPostOpen, handleReset]);

  const searchHandler = async (e: FormEvent) => {
    e.preventDefault();
    // ถ้า q ว่างหรือมีความยาวน้อยกว่า 2 อักขระ ให้หยุดการทำงาน
    if (!q || q.length < 2) {
      // alert('กรุณากรอกคำค้นหาที่ถูกต้อง');
      toastWarning('กรุณากรอกข้อมูลที่ถูกต้อง');
      return;
    }

    // const trimmedQ = q.slice(1);

    // console.log('cut', trimmedQ);
    const matchingDatam = findMatchingData(q, check && tableData);
    // console.log(matchingDatam);
    try {
      if (matchingDatam.length > 0) {
        // console.log('ok', matchingDatam);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userId = userInfo?.state?.userInfo?.id;
        const datasearch = matchingDatam[0];
        const updateDatacheck = {
          user_double_check: userId,
          user_check_time: new Date().toISOString()
        };
        const updateprescrip = {
          checkTime: new Date().toISOString(),
          userDoubleCheck: userId,
          userId: userId

        };
        await updateApi?.mutateAsync({
          id: datasearch.id, // ส่งไอดีเพื่ออัปเดตข้อมูล
          ...updateDatacheck,
        });
        await updateApip?.mutateAsync({
          id: datasearch.prescripId as string, // อัปเดตข้อมูลโดยใช้ id ของแต่ละรายการ
          ...updateprescrip,
        });
        handleReset();
        toastSuccess('ยืนยันสำเร็จ');
      } else {
        toastWarning('ไม่พบข้อมูล หรือ ยาถูกยืนยันไปแล้ว');
      }
      // setPage(1);
      setQ('');
    } catch {
      toastWarning('เกิดข้อผิดพลาด');
    }
  };
  return (
    <div className="w-full">
      <div className="m-4 flex items-center py-2">
        <Search
          setQ={setQ}
          searchHandler={searchHandler}
          q={q!}
          placeholder="ค้นหา"
        />
        <div className="pl-5">
          <Button
            variant="ghost"
            className="rounded-lg border-none  p-0"
            title="รีเซ็ต"
            onClick={handleReset}
          >
            <GrPowerReset />
          </Button>
        </div>
        <ResponsiveDialog
          isOpen={isPostOpen}
          setIsOpen={setIsPostOpen}
          title="เพิ่ม ยา"
        >

          <AddForm drugId={add} setIsOpen={setIsPostOpen} />
        </ResponsiveDialog>
        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild>
            <Button
              className="ml-auto capitalize"
              color="primary"
              onClick={() => {
                setIsPostOpen(true);
              }}
            >
              <FaNotesMedical />
              Add
            </Button>
          </DropdownMenuTrigger>
          <Button
            className="ml-auto capitalize"
            color="primary"
            onClick={() => {
              checkall();
            }}
          >
            <FaCheckDouble />
            CheckAll
          </Button> */}
          <div className="ml-auto flex items-center justify-end space-x-4 capitalize">
            <DropdownMenuTrigger asChild>
              <Button
                className="ml-auto capitalize"
                color="primary"
                onClick={() => {
                  setIsPostOpen(true);
                }}
              >
                <FaNotesMedical />
                เพิ่ม
              </Button>
            </DropdownMenuTrigger>
            {/* <Button
              className="ml-auto capitalize"
              color="primary"
              onClick={() => {
                checkall();
              }}
            >
              <FaCheckDouble />
              CheckAll
            </Button> */}

            <Button
              className="ml-auto capitalize"
              color="primary"
              onClick={() => {
                checkall();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Spinner color="default" />
                  {' '}
                  <span className="ml-2">กำลังโหลด...</span>
                </div>
              ) : (
                <>
                  <FaCheckDouble />
                  <span className="ml-2">ตรวจสอบทั้งหมด</span>
                </>
              )}
            </Button>

          </div>
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
      <div className="grid grid-cols-2 gap-4">
        {/* <div className="relative m-4 max-h-[640px] w-full overflow-auto rounded-md border"> */}
        <div className="relative m-4 overflow-y-scroll rounded-md lg:max-h-[150px] xl:max-h-[250px] 2xl:max-h-[500px] ">
          <Table className="text-base">
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

            <TableBody>
              {table.getRowModel().rows
                ?.filter(row => row.original.user_check_time === null || row.original.user_check_time === '')
                ?.length ? (
                table.getRowModel().rows
                  .filter(row => row.original.user_check_time === null || row.original.user_check_time === '')
                  .map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="p-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
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
        {/* sddsfdsfsdfsdfsd */}

        {/* <div className="relative m-4 max-h-[640px] w-full overflow-auto rounded-md border"> */}
        <div className="relative m-4 overflow-y-scroll rounded-md lg:max-h-[150px] xl:max-h-[250px] 2xl:max-h-[500px] ">
          <Table className="text-base">
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

            <TableBody>
              {table.getRowModel().rows
                ?.filter(row => row.original.user_check_time !== null && row.original.user_check_time !== '')
                ?.length ? (
                table.getRowModel().rows
                  .filter(row => row.original.user_check_time !== null && row.original.user_check_time !== '')
                  .map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="p-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
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
      <div>
        ตวจสอบแล้ว
        {' '}
        {table.getRowModel().rows
          ?.filter(row => row.original.user_check_time !== null && row.original.user_check_time !== '')
          .length}
        {' '}
        /
        {' '}
        {Datam}
      </div>
    </div>
  );
}
