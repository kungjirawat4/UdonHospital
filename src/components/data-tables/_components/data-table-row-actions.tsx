/* eslint-disable style/multiline-ternary */
'use client';

import { Spinner } from '@nextui-org/react';
import type { Row } from '@tanstack/react-table';
import { SquarePen, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import DeleteForm from './forms/delete-form';
import EditForm from './forms/edit-form-drug';
import IconMenu from './icon-menu';
// import { Print } from './print';
import { ResponsiveDialog } from './responsive-dialog';

type WithId = {
  id: string;
};
type DataTableRowActionsProps<TData> = {
  row: Row<TData> | any;
};

export function DataTableRowActions<TData extends WithId>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>(null);
  const drugId = row.original.id as string;
  const [isLoading, setIsLoading] = useState(false); // เพิ่มสถานะการโหลด

  // useEffect(() => {
  //   fetch(`/api/medicine/prescription/arranged?q=${drugId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setDataEdit(data?.data[0]);
  //       // console.log('drugId', drugId);
  //       console.log('fetch', data?.data[0]);
  //       // setLoading(false);
  //     });
  // }, [drugId]);
  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch(`/api/medicine/prescription/arranged?q=${drugId}`)
      .then(res => res.json())
      .then((data) => {
        setDataEdit(data?.data[0]);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [drugId]);

  useEffect(() => {
    if (isEditOpen) {
      fetchData();
    }
  }, [isEditOpen, fetchData]);
  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="แก้ไข ยา"
      >
        {isLoading ? (
          // <p>Loading...</p>
          // <Spinner color="danger" />// แสดงข้อความระหว่างที่ข้อมูลกำลังโหลด
          <Spinner label="กำลังโหลด..." color="danger" />
        ) : (
          <EditForm drugId={dataEdit} setIsOpen={setIsEditOpen} />
        )}
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="ต้องการลบข้อมูลหรือไม่"
        description="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?"
      >
        <DeleteForm drugId={drugId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-none border-none bg-white p-0"
          >
            <span className="sr-only">Open menu</span>
            <FaEllipsis className="size-4 text-black" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-none border bg-white"
        >
          <DropdownMenuItem className="p-0">

            {/* <Print row={row} /> */}

          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Button
              onClick={() => setIsEditOpen(true)}
              className="flex h-8 w-full min-w-32 items-center justify-start gap-x-1 rounded-none bg-white px-2 text-sm text-black hover:bg-gray-200"
            >
              <IconMenu
                text="แก้ไข"
                icon={<SquarePen className="size-4 text-black" />}
              />
            </Button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Button
              onClick={() => setIsDeleteOpen(true)}
              className="flex h-8 w-full min-w-32 items-center justify-start gap-x-1 rounded-none bg-white px-2 text-sm text-red-500 hover:bg-gray-200"
            >
              <IconMenu
                text="ลบ"
                icon={<Trash2 className="size-4 hover:text-white" />}
              />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
