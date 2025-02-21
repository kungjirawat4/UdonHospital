import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';

import { ActionButton } from '@/components/data-tables/CustomForm';
import { DateTimeLongTH } from '@/libs/dateTime';

import { delivery_options, status_options, type_options } from './filters';

type Column = {
  editHandler: (item: any) => void;
  isPending: boolean;
  deleteHandler: (item: any) => void;
};

export const columnsTH = ({
  editHandler,
  isPending,
  deleteHandler,
}: Column) => {
  return [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       onCheckedChange={(value: any) =>
    //         table.toggleAllPageRowsSelected(!!value)
    //       }
    //       aria-label="Select all"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value: any) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      // id: 'no',
      header: 'Basket ID',
      accessorKey: 'basketId',
      // size: 30,

      // cell: ({ row }: { row: any }) => (
      //   <div className="text-center">
      //     <span className="truncate font-medium">
      //       {row.getValue('basketId')}
      //     </span>
      //   </div>
      // ),
      // header: ({ column }) => (
      //   <DataTableColumnHeader column={column} title='No.' />
      // ),
      // cell: ({ row }: any) => <div>{Number(row.id) + 1}.</div>,
    },
    // {
    //   id: 'hn',
    //   header: () => <div className="w-10 text-right">HN Code</div>,
    //   accessorKey: 'hnCode',
    //   size: 100,
    //   active: true,
    // },
    { id: 'qrCode', header: 'QR Code', accessorKey: 'qrCode', active: true },
    {
      header: 'HN Code',
      accessorKey: 'hnCode',
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          <span className="truncate font-medium">{row.getValue('hnCode')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'vnCode',
      header: 'VN Code',
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          <span className="truncate font-medium">{row.getValue('vnCode')}</span>
        </div>
      ),
    },
    {
      header: 'ด่วน',
      accessorKey: 'urgent',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.urgent
          ? (
              <FaCircleCheck className="text-green-500" />
            )
          : (
              <FaCircleXmark className="text-red-500" />
            ),
    },
    {
      header: 'ประเภทคิว',
      accessorKey: 'queue_type',
      active: true,
      cell: ({ row }: any) => {
        const type = type_options.find(

          type => type.value === row.getValue('queue_type'),
        );

        if (!type) {
          return null;
        }

        return (
          <div className="flex items-center">
            {type.icon && (
              <type.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span>{type.label}</span>
          </div>
        );
      },
      filterFn: (row: any, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      header: 'สถานะ',
      accessorKey: 'prescrip_status',
      active: true,
      cell: ({ row }: any) => {
        const status = status_options.find((status) => {
          return status.value === row.getValue('prescrip_status');
        });

        if (!status) {
          return null;
        }

        return (
          <div className="flex items-center">
            {status.icon && (
              <status.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </div>
        );
      },
      filterFn: (row: any, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      header: 'รับยาที่',
      accessorKey: 'delivery',
      active: true,
      cell: ({ row }: any) => {
        const delivery = delivery_options.find((delivery) => {
          return delivery.value === row.getValue('delivery');
        });

        if (!delivery) {
          return null;
        }

        return (
          <div className="flex items-center">
            {delivery.icon && (
              <delivery.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span>{delivery.label}</span>
          </div>
        );
      },
      filterFn: (row: any, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: 'name',
      header: 'ชื่อ - นามสกุล',
      accessorKey: 'full_name',
      active: true,
    },
    {
      id: 'qcode',
      header: 'คิวรับบริการ',
      accessorKey: 'queue_code',
      active: true,
    },
    { id: 'qnum', header: 'คิวรับยา', accessorKey: 'queue_num', active: true },
    // {
    //   id: 'total',
    //   header: 'จน.จ่าย',
    //   accessorKey: 'medicine_total',
    //   active: true,
    // },
    {
      accessorKey: 'medicine_total',
      header: 'จน.จ่าย',
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          <span>{row.getValue('medicine_total')}</span>
        </div>
      ),
    },
    {
      // id: 'price',
      header: 'จำนวนเงิน',
      accessorKey: 'medicine_price',
      active: true,
      cell: ({ row }: { row: any }) => {
        const amount = Number.parseFloat(row.getValue('medicine_price'));
        const thaiBath: any = new Intl.NumberFormat('th-TH', {
          style: 'currency',
          currency: 'THB',
        }).format(amount);

        return <div className="text-right font-medium">{thaiBath}</div>;
      },
    },
    {
      id: 'created',
      header: 'วันที่สร้าง',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) => DateTimeLongTH(original?.createdAt),
    },
    // {
    //   header: 'การกระทำ',
    //   active: true,
    //   cell: ({ row: { original } }: any) => (
    //     <ActionButton
    //       editHandler={editHandler}
    //       isPending={isPending}
    //       deleteHandler={deleteHandler}
    //       original={original}
    //     />
    //   ),
    // },
    {
      header: 'การกระทำ',
      active: true,
      cell: ({ row: { original } }: any) => {
        if (original?.prescrip_status !== 'กำลังตรวจสอบ') {
          return null; // Do not show ActionButton if status is not 'กำลังตรวจสอบ'
        }
        return (
          <ActionButton
            editHandler={editHandler}
            isPending={isPending}
            deleteHandler={deleteHandler}
            original={original}
          />
        );
      },
    },
  ];
};
