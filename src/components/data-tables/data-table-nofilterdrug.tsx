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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar-nofilter';

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
  setPage?: (page: number) => void;
  // setLimit?: (limit: number) => void;
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
  columns,
  setPage,
  // setLimit,
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
console.log(data);
  const table = useReactTable({
    // data: data?.data,
    data: Array.isArray(data?.data) ? data.data : [],
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

      <div className="max-h-[750px] overflow-y-auto rounded-md border">
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
          <TableBody >
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
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
