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
import { DataTable } from '@/components/data-tables/data-tableview';
import FormViews from '@/components/data-tables/FormViews';
// import TableLoading from '@/components/data-tables/loading';
import Skeleton from '@/components/skeleton'
import { Form } from '@/components/ui/form';
import { delivery, queuetype, status } from '@/constants/drug';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';
import useDataStore from '@/zustand';

import { columns } from './columns';
// import { columnsTH } from './columnsTH';
import { delivery_options, status_options, type_options } from './filters';

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
  urgent: z.coerce.boolean(),
});

const MainForm = () => {
  // const t = useTranslations('Prescription');
  // const locale = useLocale();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [id, setId] = useState<string | null>(null);
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [q, setQ] = useState('');
  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);
  const [matchingData, setMatchingData] = useState<any>(null); // กำหนด state สำหรับ matchingData
  const { toastError, toastWarning } = useToasts();

  const getApi = ApiCall({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription/screening?page=${page}&q=${q}&limit=${limit}`,
  })?.get;
  const getApiv = ApiCall({
    key: ['prescriptionv'],
    method: 'GET',
    url: `medicine/prescriptionview/screening?page=${page}&q=${q}`,
  })?.get;
  // const getmedudhApi = useApi({
  //   key: ['udh-med'],
  //   method: 'GET',
  //   url: `medicine/udh-med`,
  // })?.get;

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
      urgent: false,
    },
  });

  // useEffect(() => {
  //   if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
  //     getApi?.refetch();
  //     getApiv?.refetch();
  //     // getmedudhApi?.refetch();
  //     setDialogOpen(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess]);

  // useEffect(() => {
  //   getApi?.refetch();
  //   getApiv?.refetch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [page]);
  // useEffect(() => {
  //   getApi?.refetch()
  //   getApiv?.refetch();
  //   // eslint-disable-next-line
  // }, [limit])
  useEffect(() => {
    getApi?.refetch();
    getApiv?.refetch();

    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      setDialogOpen(false);
    }
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess, page, limit]);


  useEffect(() => {
    if (!q) {
      getApi?.refetch();
      getApiv?.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  // let interval: any;
  // useEffect(() => {
  //   // Implementing the setInterval method
  //   const allowedIp = '172.16.2.254';
  //   const currentIp = window.location.hostname;
  //   // console.log(currentIp);
  //   if (currentIp === allowedIp) {
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     interval = setInterval(() => {
  //       getmedudhApi?.refetch();
  //     }, 30000);
  //   }
  //   // Clearing the interval
  //   return () => clearInterval(interval);
  // }, [getmedudhApi]);

  const check = getApiv?.data;
  const dataArray = Array.isArray(check?.data) ? check.data : [];
  // console.log('Data Array:', dataArray);
  // const findMatchingData = (query: string, data: any[]) => {
  //   const searchInObject = (obj: any): boolean => {
  //     return Object.values(obj).some((value) => {
  //       if (typeof value === 'string') {
  //         return value === query; // ใช้ === เพื่อให้ตรงกันทั้งหมด
  //       }
  //       if (typeof value === 'object' && value !== null) {
  //         return searchInObject(value); // ค้นหาใน object ที่ซ้อนกัน
  //       }
  //       return false;
  //     });
  //   };

  //   return data.filter(item => searchInObject(item));
  // };
  const findMatchingData = (query: string, data: any[]) => {
    const searchInObject = (obj: any): boolean => {
      return Object.entries(obj).some(([key, value]) => {
        // ข้ามการค้นหาฟิลด์ queue_num
        if (key === 'queue_num') {
          return false;
        }

        if (typeof value === 'string') {
          return value === query; // ใช้ === เพื่อให้ตรงกันทั้งหมด
        }

        if (typeof value === 'object' && value !== null) {
          return searchInObject(value); // ค้นหาใน object ที่ซ้อนกัน
        }

        return false;
      });
    };

    return data.filter(item => searchInObject(item));
  };
  const searchHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!q || q.length < 2) {
      toastWarning('กรุณากรอกข้อมูล');
      setQ('');
      return;
    }
    // ค้นหาข้อมูลที่ตรงกับ q
    const matchingDatam = findMatchingData(q, dataArray);
    if (matchingDatam.length > 0
    ) {
      if (matchingDatam[0]) {
        setDialogOpen(true);
        setMatchingData({ ...matchingDatam[0] }); // ทำการคัดลอกข้อมูลใหม่
      } else {
        // alert('ไม่พบข้อมูล');
        toastWarning('ไม่พบข้อมูล');
      }
    } else {
      // console.log('No matching data found.');
      toastWarning('ไม่พบข้อมูล');
    }
    setQ('');
    getApi?.refetch();
    getApiv?.refetch();
    setPage(1);
    // console.log('qqq', q);
  };
  useEffect(() => {
    if (matchingData) {
      setId(matchingData.id!);
      setEdit(true);

      // form.reset(matchingData); // หรือ setValue ถ้าต้องการ
      form.setValue('hnCode', matchingData?.hnCode as string);
      // form.setValue('vnCode', matchingData?.vnCode as string);
      form.setValue('fullName', matchingData?.full_name as string);
      form.setValue('queueCode', matchingData?.queue_code as string);
      form.setValue('queueNum', matchingData?.queue_num as string);
      form.setValue('queueType', matchingData?.queue_type as string || '');
      form.setValue('queueStatus', matchingData?.prescrip_status as string);
      form.setValue('delivery', matchingData?.delivery as string);
      // form.setValue('medicineTotal', Number(matchingData?.medicine_total));
      // form.setValue('medicinePrice', Number(matchingData?.medicine_price));
      form.setValue('urgent', Boolean(matchingData?.urgent));
      setIdEdit(matchingData.id!);
      // console.log('Form after update:', form.getValues()); // ตรวจสอบค่าในฟอร์มหลังอัปเดต
    }
  }, [matchingData, form]);
  // const searchHandler = (e: FormEvent) => {
  //   e.preventDefault();
  //   getApi?.refetch();
  //   setQ('');
  //   setPage(1);
  // };

  const editHandler = (item: Prescription) => {
    setId(item.id!);
    setEdit(true);
    form.setValue('hnCode', item?.hnCode as string);
    // form.setValue('vnCode', item?.vnCode as string);
    form.setValue('fullName', item?.full_name as string);
    form.setValue('queueCode', item?.queue_code as string);
    form.setValue('queueNum', item?.queue_num as string);
    form.setValue('queueType', item?.queue_type as string || '');
    form.setValue('queueStatus', item?.prescrip_status as string);
    form.setValue('delivery', item?.delivery as string);
    // form.setValue('medicineTotal', Number(item?.medicine_total));
    // form.setValue('medicinePrice', Number(item?.medicine_price));
    form.setValue('urgent', Boolean(item?.urgent));
    setIdEdit(item.id!);
  };

  const deleteHandler = (id: string) => {
    return deleteApi?.mutateAsync(id);
  };

  const label = 'ใบสั่งยา';
  const modal = 'ใบสั่งยา';

  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEdit(false);
      setId(null);
      setIdEdit(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const filterTitle2 = 'สถานะ' as string;
  const filterTitle1 = 'ประเภทคิว' as string;
  const filterTitle3 = 'สถานที่' as string;

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
        name="fullName"
        label={'ชื่อ-นามสกุล'}
        placeholder={'ชื่อ-นามสกุล'}
        type="text"

      />
      <CustomFormField
        form={form}
        name="queueCode"
        label={'คิว'}
        placeholder={'คิว'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueNum"
        label={'คิวโรบอท'}
        placeholder={'คิวโรบอท'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="queueType"
        label={'ประเภทคิว'}
        placeholder={'ประเภทคิว'}
        fieldType="command"
        data={queuetype}
      />
      <CustomFormField
        form={form}
        name="queueStatus"
        label={'สถานะ'}
        placeholder={'สถานะ'}
        fieldType="command"
        data={status}

      />
      <CustomFormField
        form={form}
        name="delivery"
        label={'สถานที่'}
        placeholder={'สถานที่'}
        fieldType="command"
        data={delivery}

      />
      <CustomFormField
        form={form}
        name="urgent"
        label={'ด่วน'}
        placeholder={'ด่วน'}
        fieldType="switch"
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
      <TopLoadingBar isFetching={getApiv?.isFetching || getApiv?.isPending} />

      <FormViews
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
        itemDetail={idEdit}
        width="max-w-[90%]"
        colum="grid grid-cols-8 gap-8 text-xs"
      />

      {getApi?.isPending ? (
        // <TableLoading />
        <Skeleton />
      ) : getApi?.isError ? (
        toastError(getApi?.error)
      ) : (
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
          hasAddp
          filter1="queue_type"
          filterTitle1={filterTitle1}
          option1={type_options}
          filter2="prescrip_status"
          filterTitle2={filterTitle2}
          option2={status_options}
          filter3="delivery"
          filterTitle3={filterTitle3}
          option3={delivery_options}
        />
      )}
    </>
  );
};

export default MainForm;
