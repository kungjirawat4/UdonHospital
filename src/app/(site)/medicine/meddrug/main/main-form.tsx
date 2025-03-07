/* eslint-disable style/multiline-ternary */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Prescription } from '@prisma/client';
// import { useLocale, useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { TopLoadingBar } from '@/components/common/TopLoadingBar';
import CustomFormField from '@/components/data-tables/CustomForm';
import { DataTable } from '@/components/data-tables/data-table-nofilterdrug';
import FormViews from '@/components/data-tables/FormViews';
// import TableLoading from '@/components/data-tables/loading';
import Skeleton from '@/components/skeleton'
import { Form } from '@/components/ui/form';
import { delivery, queuetype, status } from '@/constants/drug';
import udhmedApi from '@/services/apidrug';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';
import useDataStore from '@/zustand';

import { columns } from './columns';
// import { columnsTH } from './columnsTH';

const FormSchema = z.object({
  hnCode: z
    .string()
    .min(2, {
      message: 'hnCode must be at least 2 characters.',
    })
    .max(30, {
      message: 'hnCode must not be longer than 30 characters.',
    }),
  vnCode: z.string({
    required_error: 'Please select an vnCode to display.',
  }),
  fullName: z.string(),
  queueCode: z.string(),
  queueNum: z.string(),
  queueType: z.string(),
  queueStatus: z.string(),
  delivery: z.string(),
  medicineTotal: z.coerce.number(),
  medicinePrice: z.coerce.number(),
});

const MainForm = () => {
  // const t = useTranslations('Prescription');
  // const locale = useLocale();
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [id, setId] = useState<string | null>(null);
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [q, setQ] = useState('');
  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);

  const { toastError } = useToasts();

  const getUdhmedApi = udhmedApi({
    key: ['med-info'],
    method: 'GET',
    url: `udh/drug-info`,
  })?.get;

  const postApi = ApiCall({
    key: ['med-info'],
    method: 'POST',
    url: `udh/drug-info`,
  })?.post;

  const updateApi = ApiCall({
    key: ['med-info'],
    method: 'PUT',
    url: `udh/drug-info`,
  })?.put;

  const deleteApi = ApiCall({
    key: ['med-info'],
    method: 'DELETE',
    url: `udh/drug-info`,
  })?.delete;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hnCode: '',
      vnCode: '',
      fullName: '',
      queueCode: '',
      queueNum: '',
      queueType: '',
      queueStatus: '',
      delivery: '',
      medicineTotal: 0,
      medicinePrice: 0,
    },
  });
// useEffect(() => {
//     fetch(`http://172.16.2.254:8080/udh/drug-info`)
//       .then(res => res.json())
//       .then((data) => {
//         setgetUdhmedApi(data);
//         console.log('sd', data);
//       });
//   },[]);
  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      getUdhmedApi?.refetch();
      setDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess]);

  useEffect(() => {
    getUdhmedApi?.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!q) {
      getUdhmedApi?.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const searchHandler = (e: FormEvent) => {
    e.preventDefault();
    getUdhmedApi?.refetch();
    setQ('');
    setPage(1);
  };

  const editHandler = (item: Prescription) => {
    setId(item.id!);
    setEdit(true);
    form.setValue('hnCode', item?.hnCode as string);
    form.setValue('vnCode', item?.vnCode as string);
    form.setValue('fullName', item?.full_name as string);
    form.setValue('queueCode', item?.queue_code as string);
    form.setValue('queueNum', item?.queue_num as string);
    form.setValue('queueType', item?.queue_type as string);
    form.setValue('queueStatus', item?.prescrip_status as string);
    form.setValue('delivery', item?.delivery as string);
    form.setValue('medicineTotal', Number(item?.medicine_total));
    form.setValue('medicinePrice', Number(item?.medicine_price));
    setIdEdit(item.id!);
  };

  const deleteHandler = (id: string) => {
    return deleteApi?.mutateAsync(id);
  };

  const label = 'อัพเดทข้อมูลยา';
  const modal = 'อัพเดทข้อมูลยา';

  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEdit(false);
      setId(null);
      setIdEdit(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name="hnCode"
        label={''}
        placeholder={''}
        type="text"
      />
      <CustomFormField
        form={form}
        name="vnCode"
        label={''}
        placeholder={''}
        type="text"
      />
      <CustomFormField
        form={form}
        name="fullName"
        label={''}
        placeholder={''}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueCode"
        label={''}
        placeholder={''}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueNum"
        label={''}
        placeholder={''}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueType"
        label={''}
        placeholder={''}
        fieldType="command"
        data={queuetype}
      />
      <CustomFormField
        form={form}
        name="queueStatus"
        label={''}
        placeholder={''}
        fieldType="command"
        data={status}
      />
      <CustomFormField
        form={form}
        name="delivery"
        label={''}
        placeholder={''}
        fieldType="command"
        data={delivery}
      />
      <CustomFormField
        form={form}
        name="medicineTotal"
        label={''}
        placeholder={''}
        type="number"
      />
      <CustomFormField
        form={form}
        name="medicinePrice"
        label={''}
        placeholder={''}
        type="number"
      />
    </Form>
  );

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    // eslint-disable-next-line ts/no-unused-expressions
    edit
      ? updateApi?.mutateAsync({
        id,
        ...values,
      })
      : postApi?.mutateAsync(values);

    // console.log(id, values);
  };

  const cols = columns;


  return (
    <>
      <TopLoadingBar isFetching={getUdhmedApi?.isFetching || getUdhmedApi?.isPending} />

      <FormViews
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
        itemDetail={idEdit}
        width="max-w-[90%]"
        colum="grid grid-cols-4 gap-4 text-xs"
      />

      {getUdhmedApi?.isPending ? (
        // <TableLoading />
        <Skeleton />
      ) : getUdhmedApi?.isError ? (
        // <Message value={getApi?.error} />
        toastError(getUdhmedApi?.error)
      ) : (
        // <div className="flex-1 space-y-4 p-4 pt-">
        <DataTable
          data={getUdhmedApi?.data}
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
          hasAdd={false}
          hasAddp={false}
          // filter1="queue_type"
          // filterTitle1={filterTitle1}
          // option1={type_options}
          // filter2="prescrip_status"
          // filterTitle2={filterTitle2}
          // option2={status_options}
          // filter3="delivery"
          // filterTitle3={filterTitle3}
          // option3={delivery_options}
        />
        // </div>
      )}
    </>
  );
};

export default MainForm;
