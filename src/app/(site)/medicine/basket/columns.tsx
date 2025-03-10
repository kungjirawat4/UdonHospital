import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';

import { ActionButton } from '@/components/data-tables/CustomForm';
import { DateTimeLongEN, DateTimeLongTH } from '@/libs/dateTime';

import { basket_color } from './filters';

type Column = {
  editHandler: (item: any) => void;
  isPending: boolean;
  deleteHandler: (item: any) => void;
};
export const columns = ({
  editHandler,
  isPending,
  deleteHandler,
}: Column) => {
  return [
    {
      header: 'QR CODE',
      accessorKey: 'qrCode',
      active: true,
    },
    {
      header: 'Full CODE',
      accessorKey: 'name',
      active: true,
    },
    {
      header: 'การจับคู่',
      accessorKey: 'basket_match',
      active: true,
    },
    {
      header: 'สีตะกร้า',
      accessorKey: 'basket_color',
      cell: ({ row }: any) => {
        const color = basket_color.find(

          color => color.value === row.getValue('basket_color'),
        );

        if (!color) {
          return null;
        }
        return (
          <div className="flex w-[100px] items-center">
            {color.icon && (
              <color.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            {color?.value === 'green'
              ? (
                  <span className="text-green-500">{color.label}</span>
                )
              : color?.value === 'blue'
                ? (
                    <span className="text-blue-500">{color.label}</span>
                  )
                : color?.value === 'yellow'
                  ? (
                      <span className="text-yellow-500">{color.label}</span>
                    )
                  : (
                      <span className="text-red-500">{color.label}</span>
                    )}
            {/* <span>{color.label}</span> */}
          </div>
        );
      },
      filterFn: (row: any, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      // id: 'basket_floor',
      header: 'ชั้น',
      accessorKey: 'basket_floor',
      active: true,
    },
    {
      // id: 'status',
      header: 'สถานะ',
      accessorKey: 'basket_status',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.basket_status
          ? (
              <FaCircleCheck className="text-green-500" />
            )
          : (
              <FaCircleXmark className="text-red-500" />
            ),
    },
    {
      header: 'ประเภทตะกร้า',
      accessorKey: 'basket_type',
      cell: ({ row: { original } }: any) =>
        original?.basket_type === 'C'
          ? (
              <span className="text-green-500">คิวปกติชั้น 3</span>
            )
          : original?.basket_type === 'A'
            ? (
                <span className="text-blue-500">คิวปกติชั้น 2</span>
              )
            : original?.basket_type === 'D'
              ? (
                  <span className="text-yellow-500">คิวจิตเวช</span>
                )
              : original?.basket_type === 'B'
                ? (
                    <span className="text-red-500">คิวรับคำปรึกษา</span>
                  )
                : (
                    <span className="text-slate-500">ไม่รุบุคิว</span>
                  ),
    },

    // { header: 'Note', accessorKey: 'cabinet_note', active: true },
    {
      // id: 'created',
      header: 'created At',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) => DateTimeLongTH(original?.createdAt),
    },
    {
      id: 'actions',
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: any) => (
        <ActionButton
          editHandler={editHandler}
          isPending={isPending}
          deleteHandler={deleteHandler}
          original={original}
        />
      ),
    },
  ];
};
