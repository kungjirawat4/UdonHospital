import { ActionButton } from '@/components/data-tables/CustomForm';
import { DateTimeLongTH } from '@/libs/dateTime';

import { location_options, station_options } from './filters';

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
    { header: 'ประเภทตู้', accessorKey: 'cabinet', active: true },
    { header: 'บ้านเลขที่', accessorKey: 'HouseId', active: true },
    { header: 'ขนาดตู้', accessorKey: 'cabinet_size', active: true },
    { header: 'หัวข้อ', accessorKey: 'mqtt_topic', active: true },
    { header: 'ตำแหน่งอุปกรณ์', accessorKey: 'plcId', active: true },
    {
      header: 'สถานี',
      accessorKey: 'storage_station',
      cell: ({ row }: any) => {
        const station = station_options.find(

          station => station.value === row.getValue('storage_station'),
        );

        if (!station) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {station.icon && (
              <station.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span>{station.label}</span>
          </div>
        );
      },
      filterFn: (row: any, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      header: 'ตู้ที่',
      accessorKey: 'storage_location',
      cell: ({ row }: any) => {
        const location = location_options.find(

          location => location.value === row.getValue('storage_location'),
        );

        if (!location) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {location.icon && (
              <location.icon className="mr-2 size-4 text-muted-foreground" />
            )}
            <span>{location.label}</span>
          </div>
        );
      },
      filterFn: (
        row: { getValue: (arg0: any) => any },
        id: any,
        value: string | any[],
      ) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    { header: 'ตำแหน่ง', accessorKey: 'storage_position', active: true },
    { header: 'ระดับผู้ใช้', accessorKey: 'userLevel', active: true },
    { header: 'บันทึก', accessorKey: 'cabinet_note', active: true },
    { header: 'ยาที่เก็บ', accessorKey: 'medicine.name', active: true },
    {
      header: 'สร้างเมื่อ',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) => DateTimeLongTH(original?.createdAt),
    },
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
