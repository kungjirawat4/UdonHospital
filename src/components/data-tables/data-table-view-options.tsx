'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
// import { useTranslations } from 'next-intl';
import { FaPlus } from 'react-icons/fa';

import { Capitalize } from '@/libs/capitalize';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/ui/dropdown-menu';
import useDataStore from '@/zustand';

import { NextLink } from '../common/link';
import { FaNotesMedical } from 'react-icons/fa6';

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>;
  modal: string | undefined;
  hasAdd: boolean;
  hasAddp: boolean;
};

export function DataTableViewOptions<TData>({
  table,
  modal,
  hasAdd,
  hasAddp,
}: DataTableViewOptionsProps<TData>) {
  // const t = useTranslations('Table');
  const { setDialogOpen } = useDataStore((state: []) => state);

  const header: any = table?._getColumnDefs();
  return (
    <div className="flex items-center gap-2">
      {modal && hasAdd && (
        <Button onClick={() => setDialogOpen(true)}>
          <FaPlus />
          {' '}
          {Capitalize(modal)}
        </Button>

      )}
      {hasAddp && (

        <NextLink
          href="/medicine/screening/add"
        >
          <Button color="primary">
            <FaNotesMedical className="mr-2 size-4" />
            {'เพิ่มใบสั่งยา'}
          </Button>
        </NextLink>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 className="mr-2 size-4" />
            {'มุมมอง'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          {/* <DropdownMenuLabel>{'toggle_columns'}</DropdownMenuLabel> */}
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              column =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide(),
            )
            .map((column) => {
              const filteredUsers = header.filter(
                (header: { accessorKey: string }) => {
                  return header.accessorKey === column.id;
                },
              );

              if (filteredUsers[0] !== undefined) {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value =>
                      column.toggleVisibility(!!value)}
                  >
                    {filteredUsers[0]?.header}
                    {/* {column.id} */}
                  </DropdownMenuCheckboxItem>
                );
              }
              return null;
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
