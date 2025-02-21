'use client'

import * as React from 'react'
import { FaSort } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Role, User } from '@prisma/client'
import DateTime from '@/libs/dateTime'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { PencilIcon, XIcon } from 'lucide-react'
import ConfirmDialog from '@/components/confirm'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'

export const useColumns = ({
  editHandler,
  deleteHandler,
}: {
  editHandler: (data: User & { role: Role }) => void
  deleteHandler: (id: any) => void
}) => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,

      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            ชื่อ-นามสกุล
            <FaSort className='ml-2 h-4 w-4' />
          </Button>
        )
      },
    },
    { header: 'อีเมล์', accessorKey: 'email' },
    { header: 'บทบาท', accessorKey: 'role.name' },
    {
      header: 'สถานะ',
      accessorKey: 'status',
      cell: ({ row: { original } }: any) =>
        original?.status === 'ACTIVE' ? (
          <FaCircleCheck className='text-green-500' />
        ) : original?.status === 'PENDING_VERIFICATION' ? (
          <FaCircleXmark className='text-yellow-500' />
        ) : (
          <FaCircleXmark className='text-red-500' />
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'วันที่',
      cell: ({ row }) => (
        <span className='text-nowrap'>
          {DateTime(row.getValue('createdAt')).format('YYYY-MM-DD HH:mm') ||
            '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <BsThreeDots className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>การกระทำ</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                คัดลอกรหัสผู้ใช้
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editHandler(item as any)}>
                <PencilIcon className='mr-2 size-4' />
                แก้ไข
              </DropdownMenuItem>
              {deleteHandler && (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className='mx-0 flex h-8 w-full min-w-32 items-center justify-start gap-x-1 rounded px-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-gray-800'>
                      <XIcon className='mr-2 size-4' /> ลบ
                    </div>
                  </AlertDialogTrigger>
                  <ConfirmDialog onClick={() => deleteHandler(item.id)} />
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return {
    columns,
  }
}
