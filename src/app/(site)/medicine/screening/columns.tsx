
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';

// import { PrintCProps } from '@/app/[locale]/(auth)/medicine/check/components/data-tables/printcabon';
// import PrintAll from '@/app/[locale]/(auth)/medicine/station/[slug]/_components/printall';
import { Status } from '@/components/data-tables/buttonstatus';
import { ActionButton } from '@/components/data-tables/CustomForm';
import { DateTimeLongEN, DateTimeLongTH } from '@/libs/dateTime';

import { status_options, type_options } from './filters';

type Column = {
  editHandler: (item: any) => void;
  isPending: boolean;
  deleteHandler: (item: any) => void;
};

export const columns = ({ editHandler, isPending, deleteHandler }: Column) => {
  return [
    // {
    //   id: 'no',
    //   header: 'No.',
    //   with: 50,
    //   // header: ({ column }) => (
    //   //   <DataTableColumnHeader column={column} title='No.' />
    //   // ),
    //   cell: ({ row }: any) => <div>{Number(row.id) + 1}</div>,
    // },
    { id: 'hn', header: 'HN Code', accessorKey: 'hnCode', active: true },
    { id: 'name', header: 'ชื่อ-นามสกุล', accessorKey: 'full_name', active: true },
    // { id: 'vn', header: 'VN Code', accessorKey: 'vnCode', active: true },

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
    // { id: 'qnum', header: 'คิวโรบอท', accessorKey: 'queue_num', active: true },
    { id: 'qcode', header: 'คิวรับบริการ', accessorKey: 'queue_code', active: true },
    {
      header: 'สถานะ',
      accessorKey: 'prescrip_status',
      active: true,
      cell: ({ row }: any) => {
        const status = status_options.find(

          status => status.value === row.getValue('prescrip_status'),
        );

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
      header: 'สถานที่',
      accessorKey: 'delivery',
      active: true,
      // cell: ({ row }: any) => {
      //   // eslint-disable-next-line @typescript-eslint/no-shadow
      //   const delivery = delivery_options.find((delivery) => {
      //     return delivery.value === row.getValue('delivery_options');
      //   });

      //   if (!delivery) {
      //     return null;
      //   }

      //   return (
      //     <div className="flex w-[100px] items-center">
      //       {delivery.icon && (
      //         <delivery.icon className="mr-2 size-4 text-muted-foreground" />
      //       )}
      //       <span>{delivery.label}</span>
      //     </div>
      //   );
      // },
      // filterFn: (row: any, id: string, value: string) => {
      //   return value.includes(row.getValue(id));
      // },
    },
    { id: 'dept_name', header: 'ห้องตรวจ', accessorKey: 'dept_name', active: true },

    {
      id: 'total',
      header: 'จำนวน',
      accessorKey: 'medicine_total',
      active: true,
    },
    // {
    //   id: 'price',
    //   header: 'Amount',
    //   accessorKey: 'medicine_price',
    //   active: true,
    // },
    {
      id: 'created',
      header: 'วันที่',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) => DateTimeLongTH(original?.createdAt),
    },
    {
      header: 'การกระทำ',
      active: true,
      cell: ({ row: { original } }: any) => (
        <div className="flex items-center space-x-2">
          <ActionButton
            editHandler={editHandler}
            isPending={isPending}
            deleteHandler={deleteHandler}
            original={original}
          />
          {original.prescrip_status === 'รอคัดกรอง' && <Status row={original} />}
          {/* <Status row={original} /> */}
          {/* <PrintCProps row={original} />
          <PrintAll data={original?.arranged} datap={original} /> */}
        </div>

      ),
    },
  ];
};
