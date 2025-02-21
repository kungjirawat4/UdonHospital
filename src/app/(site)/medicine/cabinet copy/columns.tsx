import { ActionButton } from '@/components/data-tables/CustomForm';
import { DateTimeLongEN } from '@/libs/dateTime';

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
    { header: 'Cabinet', accessorKey: 'cabinet', active: true },
    { header: 'House', accessorKey: 'HouseId', active: true },
    { header: 'Size', accessorKey: 'cabinet_size', active: true },
    { header: 'Topic', accessorKey: 'mqtt_topic', active: true },
    { header: 'PlcId', accessorKey: 'plcId', active: true },
    {
      header: 'Station',
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
      header: 'Location',
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
    { header: 'Position', accessorKey: 'storage_position', active: true },
    { header: 'User Level', accessorKey: 'userLevel', active: true },
    { header: 'Note', accessorKey: 'cabinet_note', active: true },
    { header: 'Drug', accessorKey: 'medicine.name', active: true },
    {
      header: 'created At',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) => DateTimeLongEN(original?.createdAt),
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
