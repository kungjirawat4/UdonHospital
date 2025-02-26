
import PrintAll from '@/app/(site)/medicine/check/components/data-tables/_components/printall';
import { PrintCProps } from '@/app/(site)/medicine/check/components/data-tables/printcabon';
// import { Status } from '@/components/data-tables/buttonstatus';
type Column = {
  editHandler: (item: any) => void;
  isPending: boolean;
  deleteHandler: (item: any) => void;
};
export const columns = ({ editHandler, isPending, deleteHandler }: Column) =>{
  return [
    // {
    //   id: 'no',
    //   header: 'ลำดับที่',
    //   with: 50,
    //   // header: ({ column }) => (
    //   //   <DataTableColumnHeader column={column} title='No.' />
    //   // ),
    //   cell: ({ row }: any) => <div>{Number(row.id) + 1}</div>,
    // },
    { id: 'hn', header: 'HN Code', accessorKey: 'hnCode', active: true },
    { id: 'name', header: 'ชื่อ-นามสกุล', accessorKey: 'full_name', active: true },
    // { id: 'vn', header: 'VN Code', accessorKey: 'vnCode', active: true },

    // { id: 'qcode', header: 'คิวรับบริการ', accessorKey: 'queue_code', active: true },
    { id: 'qcode', header: 'คิวรับบริการ', accessorKey: 'queue_code', active: true },
    { id: 'dept_name', header: 'ห้องตรวจ', accessorKey: 'dept_name', active: true },

    {
      id: 'total',
      header: 'จน.จ่าย',
      accessorKey: 'medicine_total',
      active: true,
    },
    {
      header: 'การกระทำ',
      active: true,
      cell: ({ row: { original } }: any) => (
        <div className="flex items-center space-x-2">
          {/* {original.prescrip_status !== 'รอจับคู่ตะกร้า' && <Status row={original} />} */}
          {/* <Status row={original} /> */}
          <PrintCProps row={original} />
          <PrintAll data={original?.arranged} datap={original} />
        </div>

      ),
    },
  ];
};
