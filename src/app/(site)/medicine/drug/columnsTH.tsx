import { Image } from '@nextui-org/react';

import { ActionButton } from '@/components/data-tables/CustomForm';

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
    { header: 'รหัสยา', accessorKey: 'medicineCode', active: true },
    {
      header: 'ภาพยา',
      accessorKey: 'medicineImage1',
      active: true,
      cell: ({ row: { original } }: any) => (
        <div className="mt-2 flex items-end justify-center text-center">
          <Image
            isZoomed
            // as={NextImage}
            src={original.medicineImage1 || ''}
            width={60}
            height={60}
            alt="Drug Image1"
          />
          <Image
            isZoomed
            // as={NextImage}
            src={original.medicineImage2 || ''}
            width={60}
            height={60}
            alt="Drug Image2"
          />
          <Image
            isZoomed
            // as={NextImage}
            src={original.medicineImage3 || ''}
            width={60}
            height={60}
            alt="Drug Image3"
          />
        </div>
      ),
    },
    { header: 'ชื่อยา', accessorKey: 'name', active: true },
    { header: 'วิธีรับประทาน', accessorKey: 'medicine_method', active: true },
    { header: 'ครั้งละ', accessorKey: 'medicine_condition', active: true },
    {
      header: 'หน่วยรับประทาน',
      accessorKey: 'medicine_unit_eating',
      active: true,
    },
    { header: 'ความถี่', accessorKey: 'medicine_frequency', active: true },
    { header: 'คำสั่ง', accessorKey: 'medicine_advice', active: true },

    { header: 'หน่วยนับ', accessorKey: 'medicineUnit_th', active: true },
    // { header: 'หน่วยนับอังกฤษ', accessorKey: 'medicineUnit_en', active: true },
    { header: 'ขนาดบรรจุ', accessorKey: 'medicinePackageSize', active: true },
    { header: 'หมายเหตุ', accessorKey: 'medicineNote', active: true },
    // {
    //   header: 'CreatedAt',
    //   accessorKey: 'createdAt',
    //   active: true,
    //   cell: ({ row: { original } }: any) =>
    //     DateTime(original?.createdAt).format('DD-MM-YYYY'),
    // },
    {
      header: 'การกระทำ',
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
