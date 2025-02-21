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
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { FilterOption } from './data-table-faceted-filter';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
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
  setPage?: (page: number) => void;
  setLimit?: (limit: number) => void;
  limit?: number;
  q?: string;
  setQ?: (q: string) => void;
  searchHandler?: (e: any) => void;
  modal?: string;
  hasAdd?: boolean;
  hasAddp?: boolean;
  searchType?: React.HTMLInputTypeAttribute;
  filter1?: string | any;
  filterTitle1?: React.HTMLInputTypeAttribute | any;
  option1?: FilterOption[] | any;
  filter2?: string | any;
  filterTitle2?: React.HTMLInputTypeAttribute | any;
  option2?: FilterOption[] | any;
  filter3?: string | any;
  filterTitle3?: React.HTMLInputTypeAttribute | any;
  option3?: FilterOption[] | any;
};

export function DataTable<TData, TValue>({
  data,
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
  filter1,
  filterTitle1,
  option1,
  filter2,
  option2,
  filterTitle2,
  filter3,
  option3,
  filterTitle3,
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
  }, [data?.endIndex, data?.startIndex, data?.total, setPage]);

  const table = useReactTable({
    data: data?.data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(searchType !== 'date' && { globalFilter: q }),
    },
    enableRowSelection: true,
    columnResizeMode: 'onChange', // change column resize mode to "onChange"
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

  React.useEffect(() => {
    if (limit) {
      table?.setPageSize(Number(limit));
    } else {
      table?.setPageSize(10);
    }
  }, [limit, table]);

  return (
    <div className="space-y-4 p-1">
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
            filter1={filter1}
            filterTitle1={filterTitle1}
            option1={option1}
            filter2={filter2}
            option2={option2}
            filterTitle2={filterTitle2}
            filter3={filter3}
            option3={option3}
            filterTitle3={filterTitle3}
          />
        )
        : (
          <span />
        )}

      <div className="overflow-y-scroll rounded-md lg:max-h-[150px] xl:max-h-[250px] 2xl:max-h-[600px]">
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
            {table.getRowModel().rows?.length
              ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
              : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    ไม่พบข้อมูล.
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
