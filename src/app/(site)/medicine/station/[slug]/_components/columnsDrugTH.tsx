'use client';

import { Image } from '@nextui-org/react';
import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'medicine.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => {
      const name = row.original.medicine.name as string;
      const image = row.original.medicine.medicineImage1 as string;
      const size = row.original.medicine.medicinePackageSize as string;

      return (
        <div className="flex items-center space-x-2">
          <Image isZoomed width={100} height={100} alt={name} src={image} />
          <div className="capitalize">
            {name}
            {size}
          </div>
        </div>
      );
    },
  },
  {
    id: 'medicine_amount',
    accessorKey: 'medicine_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="amount" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('medicine_amount')}</div>
    ),
  },
  {
    accessorKey: 'medicine.medicineGenericName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="medicine Generic" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
