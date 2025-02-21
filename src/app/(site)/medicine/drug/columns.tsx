import { TfiClose } from 'react-icons/tfi';

import ImagePopup from '@/components/data-tables/_components/ImageDialog';
import { ActionButton } from '@/components/data-tables/CustomForm';

type Column = {
  editHandler: (item: any) => void;
  isPending: boolean;
  deleteHandler: (item: any) => void;
};

export const columns = ({ isPending, deleteHandler }: Column) => {
  return [
    { header: 'id', accessorKey: 'id', active: true },
    { header: 'รหัสยา', accessorKey: 'medicineCode', active: true },
    // {
    //   header: 'Image',
    //   accessorKey: 'medicineImage1',
    //   active: true,
    //   cell: ({ row: { original } }: any) => (
    //     <div className="mt-2 flex items-end justify-center text-center">
    //       <Image
    //         isZoomed
    //         as={NextImage}
    //         src={original.medicineImage1 || '/images/drug_check.png'}
    //         width={60}
    //         height={60}
    //         alt="Drug Image1"
    //       />
    //       <Image
    //         isZoomed
    //         as={NextImage}
    //         src={original.medicineImage2 || '/images/drug_check.png'}
    //         width={60}
    //         height={60}
    //         alt="Drug Image2"
    //       />
    //       <Image
    //         isZoomed
    //         as={NextImage}
    //         src={original.medicineImage3 || '/images/drug_check.png'}
    //         width={60}
    //         height={60}
    //         alt="Drug Image3"
    //       />
    //     </div>
    //   ),
    // },
    {
      header: 'รูปภาพ',
      accessorKey: 'medicineImage1',
      active: true,
      cell: ({ row }: any) => {
        const image1 = row?.original?.medicineImage1 as string;
        const image2 = row?.original?.medicineImage2 as string;
        const image3 = row?.original?.medicineImage3 as string;

        return (
          <div className="mt-2 flex items-center justify-center space-x-4">
            {/* Image 1 */}
            {image1
              ? (
                  <ImagePopup imageSrc={image1} altText="" />
                )
              : (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <TfiClose className="text-red-500" />
                    <span>No image</span>
                  </div>
                )}

            {/* Image 2 */}
            {image2
              ? (
                  <ImagePopup imageSrc={image2} altText="" />
                )
              : (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <TfiClose className="text-red-500" />
                    <span>No image</span>
                  </div>
                )}

            {/* Image 3 */}
            {image3
              ? (
                  <ImagePopup imageSrc={image3} altText="" />
                )
              : (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <TfiClose className="text-red-500" />
                    <span>No image</span>
                  </div>
                )}
          </div>
        );
      },

    },
    { header: 'ชื่อยา', accessorKey: 'name', active: true },
    { header: 'ชื่อยาภาษาไทย', accessorKey: 'medicineName_th', active: true },
    // { header: 'Method', accessorKey: 'medicine_method', active: true },
    // { header: 'Condition', accessorKey: 'medicine_condition', active: true },
    // { header: 'Unit Eating', accessorKey: 'medicine_unit_eating', active: true },
    // { header: 'Frequency', accessorKey: 'medicine_frequency', active: true },
    // { header: 'Advice', accessorKey: 'medicine_advice', active: true },
    // { header: 'Unit', accessorKey: 'medicine_unit_eating', active: true },
    {
      header: 'ขนาดบรรจุ',
      accessorKey: 'medicinePackageSize',
      active: true,
    },
    // { header: 'Note', accessorKey: 'medicineNote', active: true },
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
          // editHandler={editHandler}
          isPending={isPending}
          deleteHandler={deleteHandler}
          original={original}
        />
      ),
    },
  ];
};
