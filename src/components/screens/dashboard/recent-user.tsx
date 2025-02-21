import { DateTimeLongTH, TimeShortTH } from '@/libs/dateTime';
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from '@nextui-org/react';
import React from 'react';

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "WORKLOAD", uid: "workload" },
  { name: "ERROR", uid: "workerror" },
  { name: "LOGINTIME", uid: "logintime" },
];

const statusColorMap = {
  ACTIVE: "success",
  paused: "danger",
  vacation: "warning",
};

export function RecentUser(data: any) {
  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user?.user?.image }}
            description={user?.user?.email}
            name={user?.user?.name}
          >
            {user?.user?.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{user?.user?.bio}</p>
            <p className="text-bold text-sm capitalize text-default-400">{user?.user?.role?.name}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user?.user?.status]} size="sm" variant="flat">
            {user?.user?.status}
          </Chip>
        );
      case "workload":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{user?.user?._count?.arranged},{user?.user?._count?.prescription},{user?.user?._count?.queue}</p>
            <p className="text-bold text-sm capitalize text-default-400">จัด,เช็ค,จ่าย</p>
          </div>
        );
      case "logintime":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{TimeShortTH(user?.createdAt)}</p>
            {/* <p className="text-bold text-sm capitalize text-default-400">{user?.user?.role?.name}</p> */}
          </div>
        );
      // case "actions":
      //   return (
      // <div className="relative flex items-center gap-2">
      //   <Tooltip content="Details">
      //     <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //       <EyeIcon />
      //     </span>
      //   </Tooltip>
      //   <Tooltip content="Edit user">
      //     <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //       <EditIcon />
      //     </span>
      //   </Tooltip>
      //   <Tooltip color="danger" content="Delete user">
      //     <span className="text-lg text-danger cursor-pointer active:opacity-50">
      //       <DeleteIcon />
      //     </span>
      //   </Tooltip>
      // </div>
      // );
      default:
        return cellValue;
    }
  }, []);
  console.log(data)
  return (
    <div className="space-y-8">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data?.data}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
