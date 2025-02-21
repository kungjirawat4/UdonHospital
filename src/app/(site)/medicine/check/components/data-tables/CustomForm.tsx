/* eslint-disable style/multiline-ternary */
/* eslint-disable react/no-array-index-key */

import { ScrollShadow, Spinner, TimeInput } from '@nextui-org/react';
import { Command as CommandPrimitive } from 'cmdk';
import { CalendarIcon, X } from 'lucide-react';
// import { useLocale } from 'next-intl';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  FaCheck,
  FaEllipsis,
  FaFilePen,
  FaSort,
  FaSpinner,
  FaTrash,
} from 'react-icons/fa6';

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import useApi from '@/hooks/useApi';
import { DateLongEN, DateLongTH } from '@/libs/dateTime';
import { cn } from '@/libs/utils';
import { Calendar } from '@/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Switch } from '@/ui/switch';
import { Textarea } from '@/ui/textarea';
import useDataStore from '@/zustand';

import ConfirmDialog from './ConfirmDialog';

type Prop = Record<'value' | 'label', string>;
export type FormInputProp = {
  multiple?: boolean;
  label?: string;
  setFileLink: (e: any) => void;
  fileLink: string[];
  fileType: 'image' | 'document';
  showLabel?: boolean;
  pageType?: string;
};

type ListItem = {
  label: string;
  children: Array<{
    id: string;
    label: string;
    method?: string;
    path?: string;
  }>;
};

export type FormProps = {
  form: UseFormReturn<any, any, undefined>;
  name: any;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  cols?: number;
  rows?: number;
  step?: string;
  className?: string;
  fieldType?:
  | 'command'
  | 'switch'
  | 'multipleCheckbox'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'time';
  data?: {
    label?: string;
    value: string;
  }[];
  key?: string;
  url?: string;
  items?: ListItem[];
};
export type FormButtonProp = {
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
};

export default function CustomFormField({
  form,
  name,
  label,
  ...props
}: FormProps) {
  // const locale = useLocale();
  const [search, setSearch] = React.useState('');
  const [data, setData] = React.useState(props?.data);

  const getData = useApi({
    key: [props?.key as string, props?.url as string],
    method: 'GET',
    url: `${props?.url}&q=${search}`,
  })?.get;

  const [value] = useDebounce(search, 1000);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (props?.data?.length === 0 && props?.fieldType !== 'multipleCheckbox') {
      getData?.refetch()?.then((res) => {
        setData(
          res?.data?.data?.map((item: { name?: string; id?: string }) => ({
            label: item?.name,
            value: item?.id,
          })),
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const items = useDataStore((state: any) => state)?.data.find(
    (item: { id: any }) => item.id === name,
  )?.data as ListItem[];
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) =>

        props?.fieldType === 'multipleCheckbox' ? (
          <FormItem className="mb-3 flex flex-col">
            {items?.map((item, i) => (
              <div key={i} className="mb-2 gap-y-2 bg-slate-100 p-3">
                <FormLabel className="mb-2 pb-3 font-bold text-gray-700">
                  {item.label}
                </FormLabel>
                {item?.children?.map((child, childId) => (
                  <FormField

                    key={childId}
                    control={form.control}
                    name={name}
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={childId}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(child.id)}
                              onCheckedChange={(checked: any) => {
                                return checked
                                  ? field.onChange([...field.value, child.id])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== child.id,
                                    ),
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {child?.method || child?.path}
                            {' '}
                            {child.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            ))}

            <FormMessage className="text-xs" />
          </FormItem>

        ) : props?.fieldType === 'checkbox' ? (
          <FormItem className="mb-3 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 ">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
            </div>
          </FormItem>
        ) : (
          <FormItem className="mb-3 flex flex-col">
            <FormLabel className="text-gray-700">{label}</FormLabel>

            {props?.fieldType === 'command' ? (
              <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? data?.find(item => item.value === field.value)
                          ?.label
                        : 'Select item'}

                      <FaSort className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-full p-0">
                  <Command shouldFilter>
                    <CommandInput
                      onValueChange={setSearch}
                      value={search}
                      placeholder="Search item..."
                      className="h-9"
                    />
                    <CommandEmpty>
                      {getData?.isFetching ? 'Loading...' : 'No item found.'}
                    </CommandEmpty>
                    <CommandPrimitive.List>
                      <ScrollShadow className="h-[200px] w-full">
                        <CommandGroup>
                          {data?.map(item => (
                            <CommandItem
                              value={item.label}
                              key={item.value}
                              onSelect={() => {
                                form.setValue(name, item.value);
                                setOpen(false);
                              }}
                            >
                              {item.label}

                              <FaCheck
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  item.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollShadow>
                    </CommandPrimitive.List>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : props?.fieldType === 'switch' ? (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            ) : props?.fieldType === 'select' ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {props?.data?.map(item => (
                    <SelectItem key={item.value} value={item?.value}>
                      {item?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : props?.fieldType === 'date' ? (
              <FormControl>
                <FormItem className="flex flex-col">
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {/* {field.value
                            ? (
                                locale === 'en'
                                  ? (
                                      DateLongEN(field.value)
                                    )
                                  : (
                                      DateLongTH(field.value)
                                    )
                              )
                            : (
                                <span>Pick a date</span>
                              )} */}
                          {field.value
                            ? DateLongTH(field.value)
                            : <span>Pick a date</span>
                          }

                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        // proposed props
                        // format="YYYY-MM-DD"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              </FormControl>
            ) : props?.fieldType === 'time' ? (
              <FormControl>
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <TimeInput
                          // isRequired
                          {...field}
                          value={field?.value || '00:00'}
                        />
                      </FormControl>
                    </PopoverTrigger>
                  </Popover>
                </FormItem>
              </FormControl>
            ) : (
              <FormControl>
                {props.cols && props.rows
                  ? (
                    <Textarea {...field} {...props} />
                  )
                  : (
                    <Input className="h-9" {...field} {...props} />
                  )}
              </FormControl>
            )}

            <FormMessage className="text-xs" />
          </FormItem>
        )}
    />
  );
}

export const FormButton = ({
  label,
  className,
  type = 'submit',
  onClick,
  icon,
  loading,
  ...props
}: FormButtonProp & ButtonProps) => {
  return (
    <Button
      disabled={loading}
      type={type}
      onClick={onClick}
      className={`${loading ? 'bg-gray-500' : ''} ${className}`}
      {...props}
    >
      {loading
        ? (
          <FaSpinner className="mr-1 animate-spin" />
        )
        : (
          icon && <span className="mr-1">{icon}</span>
        )}

      {label}
    </Button>
  );
};

export const Upload = ({
  multiple = false,
  label,
  setFileLink,
  fileLink,
  fileType,
  pageType,
  showLabel = true,
  ...props
}: FormInputProp) => {
  const [file, setFile] = React.useState<string[]>([]);

  const uploadApi = useApi({
    key: ['upload'],
    method: 'POST',
    url: `uploads?type=${fileType}&page=${pageType}`,
  })?.post;

  React.useEffect(() => {
    if (file?.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < file.length; i++) {
        formData.append('file', file[i] as string);
      }

      uploadApi
        ?.mutateAsync(formData)
        .then((res: any) => {
          const urls = res.data?.map((item: any) => item.url);

          if (multiple) {
            setFileLink([...fileLink, ...urls]);
          } else {
            setFileLink(urls);
          }
        })
        .catch((err: any) => err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return (
    <div className="w-full">
      {label && showLabel && (
        <Label
          className="block text-sm font-bold"
          htmlFor={label?.replace(/\s+/g, '-')}
        >
          {label}
        </Label>
      )}

      <Input
        disabled={Boolean(uploadApi?.isPending)}
        multiple={multiple}
        type="file"
        id="formFile"
        onChange={(e: any) =>
          setFile(multiple ? e.target.files : [e.target.files[0]])}
        {...props}
        className="h-8"
      />
      {uploadApi?.isPending && (
        <div className="flex items-center justify-start">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75">
            {' '}
          </span>
          <span className="ms-2 text-sm text-gray-500">
            {fileType}
            {' '}
            is uploading
          </span>
        </div>
      )}
      {uploadApi?.isError && (
        <span className="mt-1 text-xs text-red-500">
          {`${uploadApi?.error}` || `${fileType} upload failed`}
        </span>
      )}
      {uploadApi?.isSuccess && (
        <span className="mt-1 text-xs text-green-500">
          {uploadApi?.data?.message}
        </span>
      )}
    </div>
  );
};

export const MultiSelect = ({
  data,
  selected,
  setSelected,
  label,
  form,
  name,
}: {
  data: Prop[];
  selected: Prop[];
  setSelected: React.Dispatch<React.SetStateAction<Prop[]>>;
  label?: string;
  form?: UseFormReturn<any>;
  name: string;
  // edit?: boolean;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  // const [selected, setSelected] = React.useState<Prop[]>([])
  const [inputValue, setInputValue] = React.useState('');

  const handleUnselect = React.useCallback((item: Prop) => {
    setSelected(prev => prev.filter(s => s.value !== item.value));
  }, [setSelected]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [setSelected],
  );

  const selectables = data?.filter(item => !selected.includes(item));

  React.useEffect(() => {
    if (form) {
      form.setValue(
        name,
        selected.map(item => item.value),
      );
    }
  }, [selected, form, name]);

  return (
    <>
      {label && <Label className="mb-2">{label}</Label>}

      <Command
        onKeyDown={handleKeyDown}
        className="mb-2 overflow-visible bg-transparent"
      >
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((item) => {
              return (
                <Badge key={item.value} variant="secondary">
                  {item.label}
                  <Button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="size-3 text-muted-foreground hover:text-foreground" />
                  </Button>
                </Badge>
              );
            })}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder="Select items..."
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0
            ? (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandPrimitive.List>
                  <CommandGroup className="h-full overflow-auto">
                    {selectables.map((item) => {
                      return (
                        <CommandItem
                          key={item.value}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={(): void => {
                            setInputValue('');
                            setSelected(prev => [...prev, item]);
                          }}
                          className="cursor-pointer"
                        >
                          {item.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandPrimitive.List>
              </div>
            )
            : null}
        </div>
      </Command>
      <FormMessage className="-mt-2 mb-2 text-xs">
        {form?.formState.errors?.[name]?.message as string}
      </FormMessage>
    </>
  );
};

export const ActionButton = ({
  editHandler,
  isPending,
  deleteHandler,
  original,
}: {
  editHandler?: (item: any) => void;
  isPending?: boolean;
  deleteHandler?: (item: any) => void;
  original?: any;
}) => {
  const { setDialogOpen } = useDataStore((state: any) => state);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 border-none p-0">
          <span className="sr-only">Open menu</span>
          <FaEllipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {editHandler && (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
              editHandler(original);
              setDialogOpen(true);
            }}
          >
            <FaFilePen />
            {' '}
            <span className="mx-1"> Edit</span>
          </DropdownMenuItem>
        )}

        {deleteHandler && (
          <AlertDialog>
            <AlertDialogTrigger>
              <div className="flex h-8 w-full min-w-32 items-center justify-start gap-x-1 rounded px-2 text-sm text-red-500 hover:bg-slate-100">
                {isPending
                  ? (
                    // <>
                    //   <FaSpinner label="Loading..." />
                    //   Loading
                    // </>
                    <Spinner label="Loading..." color="danger" />
                  )
                  : (
                    <>
                      <FaTrash />
                      {' '}
                      Delete
                    </>
                  )}
              </div>
            </AlertDialogTrigger>
            <ConfirmDialog onClick={() => deleteHandler(original.id)} />
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
