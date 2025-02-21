// 'use client';

// import type {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
// } from '@tanstack/react-table';
// import {
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import { useTranslations } from 'next-intl';
// import * as React from 'react';
// import { FaArrowDownWideShort, FaArrowUpWideShort } from 'react-icons/fa6';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';

// import { DataTablePagination } from './data-table-pagination';
// import { DataTableToolbar } from './data-table-toolbar-nofilter';

// type DataTableProps<TData, TValue> = {
//   columns: ColumnDef<TData, TValue>[];
//   data: {
//     data: [];
//     page?: number;
//     pages?: number;
//     total?: number;
//     startIndex?: number;
//     endIndex?: number;
//   };
//   setPage?: (page: number) => void;
//   // setLimit?: (limit: number) => void;
//   limit?: number;
//   q?: string | any;
//   setQ?: (q: string) => void;
//   searchHandler?: (e: any) => void;
//   modal?: string;
//   hasAdd?: boolean;
//   searchType?: React.HTMLInputTypeAttribute;
// };

// export function DataTable<TData, TValue>({
//   data,
//   columns,
//   setPage,
//   // setLimit,
//   limit,
//   q,
//   setQ,
//   searchHandler,
//   modal,
//   hasAdd = true,
//   searchType = 'text',
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     [],
//   );
//   const [columnVisibility, setColumnVisibility] = React.useState<any>(columns);
//   const [rowSelection, setRowSelection] = React.useState({});
//   const t = useTranslations();
//   React.useEffect(() => {
//     if (!setPage || !data?.total || !data?.startIndex || !data?.endIndex) {
//       return;
//     }
//     if (
//       Number(data?.total) < (Number(data?.startIndex) || Number(data?.endIndex))
//     ) {
//       setPage(1);
//     }
//   }, [limit, data, setPage]);

//   const table = useReactTable({
//     data: data?.data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       ...(searchType !== 'date' && { globalFilter: q }),
//     },
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   });

//   React.useEffect(() => {
//     if (limit) {
//       table?.setPageSize(Number(limit));
//     } else {
//       table?.setPageSize(10);
//     }
//   }, [limit, table]);

//   return (
//     <div className="space-y-4">
//       {setQ && searchHandler
//         ? (
//             <DataTableToolbar
//               table={table}
//               setQ={setQ}
//               searchHandler={searchHandler}
//               placeholder={t('Common.search')}
//               q={q!}
//               type={searchType}
//               modal={modal}
//               hasAdd={hasAdd}
//             />
//           )
//         : (
//             <span />
//           )}

//       <div className="max-h-[750px] overflow-y-auto rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map(headerGroup => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <TableHead
//                     className="px-2 py-0"
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler()}
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : (
//                           <div className="flex flex-row items-center justify-start gap-1">
//                             {flexRender(
//                               header.column.columnDef.header,
//                               header.getContext(),
//                             )}
//                             {header.column.getIsSorted()
//                               ? (
//                                   header.column.getIsSorted() === 'asc'
//                                     ? (
//                                         <FaArrowUpWideShort />
//                                       )
//                                     : (
//                                         <FaArrowDownWideShort />
//                                       )
//                                 )
//                               : null}
//                           </div>
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length
//               ? (
//                   table.getRowModel().rows.map(row => (
//                     <TableRow
//                       key={row.id}
//                       data-state={row.getIsSelected() && 'selected'}
//                     >
//                       {row.getVisibleCells().map(cell => (
//                         <TableCell key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext(),
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 )
//               : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}
//           </TableBody>
//         </Table>
//       </div>
//       <DataTablePagination table={table} />
//     </div>
//   );
// }

'use client';

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
// import { useTranslations } from 'next-intl';
import * as React from 'react';
import { FaArrowDownWideShort, FaArrowUpWideShort } from 'react-icons/fa6';
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar-nofilter';
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortDown,
  FaSortUp,
} from 'react-icons/fa6'
import { FormatNumber } from '@/components/format-number'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: {
    data: [];
    page?: number;
    pages?: number;
    total?: number;
    startIndex?: number;
    endIndex?: number;
  };
  datav: {
    data: [];
    page?: number;
    pages?: number;
    total?: number;
    startIndex?: number;
    endIndex?: number;
  };
  setPage?: (page: number) => void;
  setLimit?: (limit: number) => void;
  limit?: number;
  q?: string | any;
  setQ?: (q: string) => void;
  searchHandler?: (e: any) => void;
  modal?: string;
  hasAdd?: boolean;
  hasAddp?: boolean;
  searchType?: React.HTMLInputTypeAttribute;
};

export function DataTable<TData, TValue>({
  data,
  datav,
  columns,
  setPage,
  setLimit,
  limit,
  q,
  setQ,
  searchHandler,
  modal,
  hasAdd = true,
  hasAddp = true,
  searchType = 'text',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = React.useState<any>(columns);
  const [rowSelection, setRowSelection] = React.useState({});
  // const t = useTranslations();
  React.useEffect(() => {
    if (!setPage || !data?.total || !data?.startIndex || !data?.endIndex) {
      return;
    }
    if (
      Number(data?.total) < (Number(data?.startIndex) || Number(data?.endIndex))
    ) {
      setPage(1);
    }
  }, [limit, data, setPage]);

  const filteredData = React.useMemo(() => {
    // ตรวจสอบว่ามี q หรือไม่
    if (q && Array.isArray(data?.data)) {
      const filtered = data.data.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(q.toLowerCase())
      );
      // ถ้าไม่เจอข้อมูลใน data.data ให้ใช้ datav.data แทน
      return filtered.length > 0 ? filtered : datav?.data || [];
    }
    return data?.data || [];
  }, [q, data, datav]);
  
  const table = useReactTable({
    // data: data?.data,
    // data: Array.isArray(data?.data) ? data.data : [],
    data: filteredData,

    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(searchType !== 'date' && { globalFilter: q }),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  // console.log('data', data);
  React.useEffect(() => {
    if (limit) {
      table?.setPageSize(Number(limit));
    } else {
      table?.setPageSize(10);
    }
  }, [limit, table]);
  // console.log('sss',data);
  // console.log('Page:', page, 'Limit:', limit);

  return (
    <div className="space-y-4">
      {setQ && searchHandler
        ? (
            <DataTableToolbar
              table={table}
              setQ={setQ}
              searchHandler={searchHandler}
              placeholder={'ค้นหา'}
              q={q!}
              type={searchType}
              modal={modal}
              hasAdd={hasAdd}
              hasAddp={hasAddp}
            />
          )
        : (
            <span />
          )}

      {/*  <div className="max-h-[750px] overflow-y-auto rounded-md border lg:max-h-[150px] xl:max-h-[250px] 2xl:max-h-[600px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    className="px-2 py-0"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                          <div className="flex flex-row items-center justify-start gap-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getIsSorted()
                              ? (
                                  header.column.getIsSorted() === 'asc'
                                    ? (
                                        <FaArrowUpWideShort />
                                      )
                                    : (
                                        <FaArrowDownWideShort />
                                      )
                                )
                              : null}
                          </div>
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows && table.getRowModel().rows.length > 0
              ? table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
              : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>

        </Table>
      </div> */}
            <div className='relative overflow-x-auto rounded-md border '>
              <Table className='text-xs md:text-sm'>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className='py-0 text-xs md:text-sm'
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                      No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
      {/* <DataTablePagination table={table} /> */}
      <div className='my-3 flex flex-col items-center justify-between gap-2 sm:flex-row'>
        {setLimit && limit && (
          <div className='flex items-center justify-start gap-x-1'>
            <span className='flex h-10 items-center justify-center rounded-md border px-2 font-sans text-sm text-gray-700'>
              จำนวนแถวต่อหน้า
            </span>
            <Select
              defaultValue={limit?.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className='w-auto focus:hidden'>
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50, 100, 200,data?.total ].map((limit) => (
                  <SelectItem key={limit} value={limit?.toString()}>
                    {/* {limit} */}
                    {limit === data?.total ? "ทั้งหมด" : limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {setPage && data?.page && data?.pages ? (
          <div className='flex gap-x-1'>
            <Button
              className='rounded-br-none rounded-tr-none'
              variant='outline'
              onClick={() => setPage(1)}
            >
              <FaAnglesLeft />
            </Button>
            <Button
              className='rounded-none'
              variant='outline'
              disabled={data?.page === 1}
              onClick={() => setPage(Number(data?.page) - 1)}
            >
              <FaChevronLeft />
            </Button>
            <Button className='rounded-none' variant='outline'>
              <FormatNumber value={data?.startIndex || 0} isCurrency={false} />
              <span className='mx-1'> - </span>{' '}
              <FormatNumber value={data?.endIndex || 0} isCurrency={false} />
              <span className='mx-1'> of </span>
              <FormatNumber value={data?.total || 0} isCurrency={false} />
            </Button>
            <Button
              className='rounded-none'
              variant='outline'
              disabled={data?.page === data?.pages}
              onClick={() => setPage(Number(data?.page) + 1)}
            >
              <FaChevronRight />
            </Button>
            <Button
              className='rounded-bl-none rounded-tl-none'
              variant='outline'
              onClick={() => setPage(Number(data?.pages))}
            >
              <FaAnglesRight />
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
