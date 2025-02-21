'use client';

import type { Row } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const drugId = row.original.id as string;

  const [dataEdit, setDataEdit] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/medicine/prescription/arranged?q=${drugId}`)
      .then(res => res.json())
      .then((data) => {
        setDataEdit(data?.data[0]);
        // setLoading(false);
      });
  }, [drugId]);
  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Drug"
      >
        <EditForm drugId={dataEdit} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete Person"
        description="Are you sure you want to delete this person?"
      >
        <DeleteForm drugId={drugId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-50 w-[160px]">
          <DropdownMenuItem className="group flex w-full items-center  justify-between p-0 text-left text-sm text-neutral-500 ">
            <Button
              onClick={() => {
                setIsEditOpen(true);
              }}
              className="flex w-full justify-start rounded-md p-2 transition-all duration-75 hover:bg-blue-300"
            >
              <IconMenu text="Edit" icon={<SquarePen className="size-4" />} />
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center  justify-between p-0 text-left text-sm text-neutral-500 ">
            <Button
              onClick={() => {
                setIsDeleteOpen(true);
              }}
              className="flex w-full justify-start rounded-md p-2 text-neutral-500 transition-all duration-75 hover:bg-red-300"
            >
              <IconMenu text="Delete" icon={<Trash2 className="size-4" />} />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
