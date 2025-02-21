import ButtonUpdate from '@/components/data-tables/buttonupdate';
import { DateTimeLongEN } from '@/libs/dateTime';

// type Column = {
//   editHandler: (item: any) => void;
//   isPending: boolean;
//   deleteHandler: (item: any) => void;
// };

export const columns = (p0?: unknown) => {
  return [
    // {
    //   accessorKey: 'no',
    //   header: 'No.',
    //   with: 50,
    //   // header: ({ column }) => (
    //   //   <DataTableColumnHeader column={column} title='No.' />
    //   // ),
    //   cell: ({ row }: any) => <div>{Number(row.id) + 1}</div>,
    // },
    {
      header: 'Code',
      accessorKey: 'code',
      active: true,
    },
    { header: 'Thai_Name', accessorKey: 'thai_name', active: true },
    { header: 'Eng_Name', accessorKey: 'name', active: true },
    {
      header: 'GenName',
      accessorKey: 'gen_name',
      active: true,
    },
    {
      header: 'GenshName',
      accessorKey: 'gen_shname',
      active: true,
    },
    {
      header: 'Strength',
      accessorKey: 'strgth', // Main field
      active: true,
      cell: ({ row }: any) => `${row.original.strgth} ${row.original.strgth_u}`, // Concatenate strgth and strgth_u
    },
    {
      header: 'package',
      accessorKey: 'package',
      active: true,
    },
    {
      header: 'def_dose',
      accessorKey: 'def_dose',
      active: true,
    },
    { header: 'med_class_code', accessorKey: 'med_class_code', active: true },
    // {
    //   header: 'created At',
    //   accessorKey: 'createdAt',
    //   active: true,
    //   cell: ({ row: { original } }: any) => DateTimeLongEN(original?.createdAt),
    // },
    {
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: { row: { original: any } }) => (
        <ButtonUpdate
          data={original} // Pass the row data to ButtonUpdate
        />
      ),
    },
  ];
};
