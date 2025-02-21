import { ActionButton } from '@/components/data-tables/CustomForm';
import { DateTimeLongEN, DateTimeLongTH } from '@/libs/dateTime';

import {
  location_options,
  station_options,
} from './filters';

type Column = {
  editHandler: (item: any) => void;
  isPending: boolean;
  deleteHandler: (item: any) => void;
};

export const columns = ({ editHandler, isPending, deleteHandler }: Column) => {
  return [
    { header: 'ตู้', accessorKey: 'cabinet', active: true },
    { header: 'บ้าน', accessorKey: 'HouseId', active: true },
    { header: 'ขนาด', accessorKey: 'cabinet_size', active: true },
    { header: 'หัวข้อ', accessorKey: 'mqtt_topic', active: true },
    { header: 'PlcId', accessorKey: 'plcId', active: true },
    {
      header: 'สถานี',
      accessorKey: 'storage_station',
      active: true,
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
      header: 'ที่ตั้ง',
      accessorKey: 'storage_location',
      active: true,
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
        row: any,
        id: any,
        value: string | any[],
      ) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    { header: 'ตำแหน่ง', accessorKey: 'storage_position', active: true },
    { header: 'ระดับผู้ใช้', accessorKey: 'userLevel', active: true },
    { header: 'บันทึก', accessorKey: 'cabinet_note', active: true },
    { header: 'ยา', accessorKey: 'medicine.name', active: true },
    {
      header: 'วันที่',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) => DateTimeLongTH(original?.createdAt),
    },
    {
      id: 'actions',
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
