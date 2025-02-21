import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
// import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';

import { Button } from '@/ui/button';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
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
  filter1?: string | '';
  filterTitle1?: React.HTMLInputTypeAttribute | undefined;
  option1?: any;
  filter2?: string | '';
  filterTitle2?: React.HTMLInputTypeAttribute | undefined;
  option2?: any;
  filter3?: string | '';
  filterTitle3?: React.HTMLInputTypeAttribute | undefined;
  option3?: any;
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
  filter1,
  filterTitle1,
  option1,
  filter2,
  option2,
  filterTitle2,
  filter3,
  option3,
  filterTitle3,
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
        {table.getColumn(`${filter1}`) && (
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
        )}
        {table.getColumn(`${filter3}`) && (
          <DataTableFacetedFilter
            column={table.getColumn(`${filter3}`)}
            title={filterTitle3}
            options={option3}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {'ล้างค่า'}
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} modal={modal} hasAdd={hasAdd} hasAddp={hasAddp} />
    </div>
  );
}
