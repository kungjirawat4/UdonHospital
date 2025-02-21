import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
// import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';

import { DataTableViewOptions } from './data-table-view-options';
import Search from './Search';

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  q: string;
  setQ: (value: string) => void;
  placeholder: string;
  searchHandler: (e: FormEvent) => void;
  type?: string;
  modal: string | undefined;
  hasAdd: boolean;
  hasAddp: boolean;
};

export function DataTableToolbar<TData>({
  table,
  q,
  setQ,
  placeholder,
  searchHandler,
  type = 'text',
  modal,
  hasAdd = true,
  hasAddp = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  // const t = useTranslations();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Search
          setQ={setQ}
          searchHandler={searchHandler}
          placeholder={placeholder}
          q={q!}
          type={type}
        />
        {/* {table.getColumn(`${filter1}`) && (
          <DataTableFacetedFilter
            column={table.getColumn(`${filter1}`)}
            title={filterTitle1}
            options={option1}
          />
        )}
        {table.getColumn(`${filter2}`) && (
          <DataTableFacetedFilter
            column={table.getColumn(`${filter2}`)}
            title={filterTitle2}
            options={option2}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {'Table.reset'}
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} modal={modal} hasAdd={hasAdd} hasAddp={hasAddp} />
    </div>
  );
}
