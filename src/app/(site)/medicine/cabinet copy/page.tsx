/* eslint-disable ts/no-unused-expressions */
/* eslint-disable style/multiline-ternary */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Cabinet } from '@prisma/client';
// import { useLocale, useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import BreadCrumb from '@/components/common/breadcrumb';
import { TopLoadingBar } from '@/components/common/TopLoadingBar';
import CustomFormField from '@/components/data-tables/CustomForm';
import { DataTable } from '@/components/data-tables/data-table';
import FormView from '@/components/data-tables/FormView';
// import TableLoading from '@/components/data-tables/loading';
import { Form } from '@/components/ui/form';
import { cabinet, location, size, station } from '@/constants/drug';
// import Message from '@/components/common/Message';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import useDataStore from '@/zustand';

import { columns } from './columns';
// import { columnsTH } from './columnsTH';
import { location_options, station_options } from './filters';
import ApiCall from '@/services/api';
import Skeleton  from '@/components/skeleton';
const FormSchema = z.object({
  cabinet: z.string().refine(value => value !== '', {
    message: 'Cabinet is required',
  }),
  house_id: z.string(),
  cabinet_size: z.string().refine(value => value !== '', {
    message: 'Size is required',
  }),
  userLevel: z.string().refine(value => value !== '', {
    message: 'User Level is required',
  }),
  storage_station: z.string().refine(value => value !== '', {
    message: 'Station is required',
  }),
  storage_location: z.string().refine(value => value !== '', {
    message: 'Location is required',
  }),
  storage_position: z.string().refine(value => value !== '', {
    message: 'Position is required',
  }),
  cabinet_note: z.string().optional(),
  plcId: z.string().optional(),
});

const Page = () => {
  // const t = useTranslations();
  // const locale = useLocale();
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [id, setId] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [q, setQ] = useState('');

  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);

  const breadcrumbItems = [
    { title: 'ตู้ยา', link: '/drug/cabinet' },
  ];
  const { toastError } = useToasts();
  const getApi = ApiCall({
    key: ['cabinet'],
    method: 'GET',
    url: `medicine/cabinet?page=${page}&q=${q}`,
  })?.get;

  const postApi = ApiCall({
    key: ['cabinet'],
    method: 'POST',
    url: `medicine/cabinet`,
  })?.post;

  const updateApi = ApiCall({
    key: ['cabinet'],
    method: 'PUT',
    url: `medicine/cabinet`,
  })?.put;

  const deleteApi = ApiCall({
    key: ['cabinet'],
    method: 'DELETE',
    url: `medicine/cabinet`,
  })?.delete;

  const hospital = 'UDH';

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cabinet: '',
      house_id: '',
      cabinet_size: '',
      userLevel: '1',
      storage_station: '',
      storage_location: '',
      storage_position: '',
      cabinet_note: '',
      plcId: '',
    },
  });

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch();
      setDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess]);

  useEffect(() => {
    getApi?.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!q) {
      getApi?.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const searchHandler = (e: FormEvent) => {
    e.preventDefault();
    getApi?.refetch();
    setPage(1);
  };

  const editHandler = (item: Cabinet & { medicine: { id: string } }) => {
    setId(item.id!);
    setEdit(true);
    form.setValue('cabinet', item?.cabinet as string);
    form.setValue('house_id', item?.HouseId as string);
    form.setValue('cabinet_size', item?.cabinet_size as string);
    form.setValue('storage_station', item?.storage_station as string);
    form.setValue('storage_location', item?.storage_location as string);
    form.setValue('storage_position', item?.storage_position as string);
    form.setValue('userLevel', item?.userLevel as string);
    form.setValue('cabinet_note', item?.cabinet_note || '');
    form.setValue('plcId', item?.plcId as string || '');
  };

  const deleteHandler = (id: string) => {
    return deleteApi?.mutateAsync(id);
  };

  const label = 'ตู้ยา';
  const modal = 'ตู้ยา';

  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEdit(false);
      setId(null);
    }
  }, [dialogOpen, form]);

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name="cabinet"
        label={'ตู้'}
        placeholder="Cabinet Type"
        fieldType="command"
        data={cabinet}
      />
      <CustomFormField
        form={form}
        name="house_id"
        label="บ้านยา"
        placeholder="house"
        type="text"
      />
      <CustomFormField
        form={form}
        name="cabinet_size"
        label={'ขนาดตู้'}
        placeholder="Cabinet size"
        fieldType="command"
        data={size}
      />
      <CustomFormField
        form={form}
        name="userLevel"
        label={'ระดับสิทธิ์'}
        placeholder="userLevel"
        type="text"
      />
      <CustomFormField
        form={form}
        name="storage_station"
        label={'สถานีตู้'}
        placeholder="storage_station"
        fieldType="command"
        data={station}
      />
      <CustomFormField
        form={form}
        name="storage_location"
        label={'ที่ตั้งตู้'}
        placeholder="storage_location"
        fieldType="command"
        data={location}
      />
      <CustomFormField
        form={form}
        name="storage_position"
        label={'ตำแหน่งตู้'}
        placeholder="storage_position"
        type="text"
      />
      <CustomFormField
        form={form}
        name="plcId"
        label="ตำแหน่งตู้"
        placeholder="plcId"
        type="text"
      />
      <CustomFormField
        form={form}
        name="cabinet_note"
        label={'หมายเหตุ'}
        placeholder="cabinet_note"
        cols={3}
        rows={3}
      />
    </Form>
  );

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    edit
      ? updateApi?.mutateAsync({
        id,
        ...values,
        mqtt_topic: `${hospital}/${values.storage_station}/${
          values.storage_location
        }/${values.storage_position}`,
      })
      : postApi?.mutateAsync(values);
  };

  const cols = columns;
  const filterTitle1 = 'สถานีตู้' as string;
  const filterTitle2 = 'ตำแหน่งตู้' as string;

  return (
    <>
      {/* {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {postApi?.isSuccess && <Message value={postApi?.data?.message} />}
      {postApi?.isError && <Message value={postApi?.error} />} */}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
        width="max-w-[40%]"
        height="max-h-[70%]"
        colum="grid grid-cols-2 gap-2"
      />

      {getApi?.isPending ? (
        // <TableLoading />
        <Skeleton />
      ) : getApi?.isError ? (
        // <Message value={getApi?.error} />
        toastError(getApi?.error)
      ) : (
        <div className="flex-1 space-y-4 p-4 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <DataTable
            data={getApi?.data}
            columns={cols({
              editHandler,
              isPending: deleteApi?.isPending || false,
              deleteHandler,
            })}
            setPage={setPage}
            // setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            modal={modal}
            filter1="storage_station"
            filterTitle1={filterTitle1}
            option1={station_options}
            filter2="storage_location"
            option2={location_options}
            filterTitle2={filterTitle2}
            option3={false}
            filterTitle3={false}
            hasAdd
            hasAddp={false}
          />
        </div>
      )}
    </>
  );
};

export default Page;
