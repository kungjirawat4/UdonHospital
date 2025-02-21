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
import { DataTable } from '@/components/data-tables/data-table-nofilter';
import FormViews from '@/components/data-tables/FormViews';
// import TableLoading from '@/components/data-tables/loading';
import { Form } from '@/components/ui/form';
import { delivery, queuetype, status } from '@/constants/drug';
// import udhApi from '@/hooks/udhApi';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import useDataStore from '@/zustand';
import Skeleton from '@/components/skeleton'
import { columns } from './columns';
// import { Button } from '@/components/ui/button';
import ApiCall from '@/services/api';
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
  const [limit, setLimit] = useState(20);
  const [id, setId] = useState<string | null>(null);
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [q, setQ] = useState('');
  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);

  const { toastError } = useToasts();

  const getApi = ApiCall({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription?page=${page}&q=${q}&limit=${limit}`,
  })?.get;

  const getApiv = ApiCall({
    key: ['prescriptionv'],
    method: 'GET',
    url: `medicine/prescription?page=${page}&q=${q}`,
  })?.get;

  const postApi = ApiCall({
    key: ['prescription'],
    method: 'POST',
    url: `medicine/prescription`,
  })?.post;

  const updateApi = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription`,
  })?.put;

  const deleteApi = ApiCall({
    key: ['prescription'],
    method: 'DELETE',
    url: `medicine/prescription`,
  })?.delete;
  // console.log(getApi?.data)
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
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  useEffect(() => {
    if (!q) {
      getApi?.refetch();

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const searchHandler = (e: FormEvent) => {
    e.preventDefault();
    getApi?.refetch();
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

  const label = 'prescription';
  const modal = 'prescription';

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
        label={'hn'}
        placeholder={'hn'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="vnCode"
        label={'vn'}
        placeholder={'vn'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="fullName"
        label={'name'}
        placeholder={'name'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueCode"
        label={'queue'}
        placeholder={'queue'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueNum"
        label={'queue_num'}
        placeholder={'queue_num'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueType"
        label={'queue_type'}
        placeholder={'queue_type'}
        fieldType="command"
        data={queuetype}
      />
      <CustomFormField
        form={form}
        name="queueStatus"
        label={'queue_type'}
        placeholder={'queue_type'}
        fieldType="command"
        data={status}
      />
      <CustomFormField
        form={form}
        name="delivery"
        label={'delivery'}
        placeholder={'delivery'}
        fieldType="command"
        data={delivery}
      />
      <CustomFormField
        form={form}
        name="medicineTotal"
        label={'amount'}
        placeholder={'amount'}
        type="number"
      />
      <CustomFormField
        form={form}
        name="medicinePrice"
        label={'service_charge'}
        placeholder={'service_charge'}
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

  // console.log(getUdhApi?.data);
  // useEffect(() => {
  //   fetch(`http://172.16.2.254:8080/udh/med-info`)
  //     .then(res => res.json())
  //     .then((data) => {
  //       console.log('sd', data);
  //     });
  // });
  // const handleConfirm = () => {
  //  console.log('okokok');
  //         toastError('เกิดข้อผิดพลาดในการพิมพ์');



  // };
  return (
    <>

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

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

      {getApi?.isPending ? (
        // <TableLoading />
        <Skeleton />
      ) : getApi?.isError ? (
        // <Message value={getApi?.error} />
        toastError(getApi?.error)
        // console.log(getApi?.error.message)
      ) : (
        // <div className="flex-1 space-y-4 p-4 pt-">
        <DataTable
          data={getApi?.data}
          datav={getApiv?.data}

          columns={cols({
            editHandler,
            isPending: deleteApi?.isPending || false,
            deleteHandler,
          })}
          setPage={setPage}
          setLimit={setLimit}
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
