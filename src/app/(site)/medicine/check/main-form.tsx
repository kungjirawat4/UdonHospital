

// /* eslint-disable style/multiline-ternary */
// /* eslint-disable ts/no-unused-expressions */
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
// import CustomFormField from '@/components/data-tables/CustomForm';
import { DataTable } from '@/components/data-tables/data-tableview';
import TableLoading from '@/components/data-tables/loading';
import { Form } from '@/components/ui/form';
// import { status } from '@/constants/drug';
import useToasts from '@/hooks/use-toasts';
import useApi from '@/hooks/useApi';
import useDataStore from '@/zustand';
import ApiCall from '@/services/api';
import { columns } from './columns';
import { columnsTH } from './columnsTH';
import FormViews from './components/data-tables/FormViewsdoublec';
import { delivery_options, status_options, type_options } from './filters';
import Skeleton from '@/components/skeleton';
import useAuthorization from '@/hooks/useAuthorization';
import { useRouter } from 'next/navigation';
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
  pay_type: z.string(),
  medicineTotal: z.coerce.number(),
  medicinePrice: z.coerce.number(),
  urgent: z.coerce.boolean(),
});

const MainForm = () => {
  // const t = useTranslations();
  // const locale = useLocale();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10)
  const [id, setId] = useState<string | null>(null);
  const [idEdit, setIdEdit] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [q, setQ] = useState('');
  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);
  const [matchingData, setMatchingData] = useState<any>(null); // กำหนด state สำหรับ matchingData
  const { toastError, toastWarning } = useToasts();
  const getApi = useApi({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription/doublecheck?page=${page}&q=${q}&limit=${limit}`,
  })?.get;
  const getApiv = useApi({
    key: ['prescriptionv'],
    method: 'GET',
    url: `medicine/prescriptionview/doublecheck?page=${page}&q=${q}`,
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

  const path = useAuthorization()
  const router = useRouter()
  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

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
      pay_type: '',
      medicineTotal: 0,
      medicinePrice: 0,
      urgent: false,
    },
  });

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
    // แสดงข้อมูลที่ตรงกันใน log
    // console.log('Matching Data:', matchingDatam); // ตรวจสอบข้อมูลที่ค้นหา
    if (matchingDatam.length > 0
      // && q.length === 25
    ) {
      // if (matchingDatam[0].prescrip_status === 'กำลังตรวจสอบ') {
      if (matchingDatam[0]) {
        setDialogOpen(true);
        // setMatchingData(matchingDatam[0]);
        setMatchingData({ ...matchingDatam[0] }); // ทำการคัดลอกข้อมูลใหม่

        // console.log('matchingData:', matchingData);
        // getApi?.refetch();
      } else {
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
    // console.log('Matching Data in useEffect:', matchingData);
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
      // form.setValue('queueStatus', matchingData?.prescrip_status as string);
      form.setValue('queueStatus', 'รอเรียกคิว');
      form.setValue('delivery', matchingData?.delivery as string);
      form.setValue('pay_type', matchingData?.pay_type as string);
      // form.setValue('medicineTotal', Number(matchingData?.medicine_total));
      // form.setValue('medicinePrice', Number(matchingData?.medicine_price));
      form.setValue('urgent', Boolean(matchingData?.urgent));
      setIdEdit(matchingData.id!);
      // console.log('Form after update:', form.getValues()); // ตรวจสอบค่าในฟอร์มหลังอัปเดต
    }
  }, [matchingData, form]);

  const editHandler = (item: Prescription) => {
    setId(item.id!);
    setEdit(true);
    form.setValue('hnCode', item?.hnCode as string);
    // form.setValue('vnCode', item?.vnCode as string);
    form.setValue('fullName', item?.full_name as string);
    form.setValue('queueCode', item?.queue_code as string);
    form.setValue('queueNum', item?.queue_num as string);
    form.setValue('queueType', item?.queue_type as string || '');
    // form.setValue('queueStatus', item?.prescrip_status as string);
    form.setValue('queueStatus', 'รอเรียกคิว');
    form.setValue('delivery', item?.delivery as string);
    form.setValue('pay_type', item?.pay_type as string);
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
  const formValues = form.getValues();
  const formFields = (
    <Form {...form}>
      <div className="text-[16px] font-semibold text-gray-600">
        {'HN'}
        <br />
        <br />

        <span className="text-black">{formValues.hnCode}</span>
      </div>
      <div className="text-[16px] font-semibold text-gray-600">
        ชื่อ-นามสกุล
        <br />
        <br />

        <span className="text-black">{formValues.fullName}</span>
      </div>
      <div className="text-[16px] font-semibold text-gray-600">
        ประเภทคิว
        <br />
        <br />

        <span className="text-black">{formValues.queueType}</span>
      </div>
      <div className="text-[16px] font-semibold text-gray-600">
        คิวที่
        <br />
        <br />

        <span className="text-black">{formValues.queueCode}</span>
      </div>
      {/* <div className="text-[16px] font-semibold text-gray-600">
        คิวโรบอท
        <br />
        <br />

        <span className="text-black">{formValues.queueNum}</span>
      </div> */}
      {/* <CustomFormField
        form={form}
        name="hnCode"
        label={t('Doublecheck.hn')}
        placeholder={t('Doublecheck.hn')}
        type="text"
      />
      <CustomFormField
        form={form}
        name="fullName"
        label={t('Doublecheck.name')}
        placeholder={t('Doublecheck.name')}
        type="text"

      />
      <CustomFormField
        form={form}
        name="queueCode"
        label={t('Doublecheck.queue')}
        placeholder={t('Doublecheck.queue')}
        type="text"
      /> */}
      {/* <CustomFormField
        form={form}
        name="queueNum"
        label={t('Doublecheck.queue_num')}
        placeholder={t('Doublecheck.queue_num')}
        type="text"
      /> */}
      {/* <CustomFormField
        form={form}
        name="queueType"
        label={t('Doublecheck.queue_type')}
        placeholder={t('Doublecheck.queue_type')}
        fieldType="command"
        data={queuetype}
      /> */}
      {/* <CustomFormField
        form={form}
        name="queueStatus"
        label={t('Doublecheck.status')}
        placeholder={t('Doublecheck.status')}
        fieldType="command"
        data={status}

      /> */}
      <div className="text-[16px] font-semibold text-gray-600">
        สถานะ
        {' '}
        <br />
        <br />

        <span className="text-black">{formValues.queueStatus}</span>
      </div>
      {/* <CustomFormField
        form={form}
        name="delivery"
        label={t('Doublecheck.delivery')}
        placeholder={t('Doublecheck.delivery')}
        fieldType="command"
        data={delivery}

      /> */}
      {/* <div className="text-[16px] font-semibold text-gray-600">
        สถานที่
        {' '}
        <br />
        <br />

        <span className="text-black">{formValues.delivery}</span>
      </div> */}
      <div className="text-[16px] font-semibold text-gray-600">
        สิทธิ์การรักษา
        {' '}
        <br />
        <br />

        <span className="text-black">{formValues.pay_type}</span>
      </div>
      <div className="text-[16px] font-semibold text-gray-600">
        ด่วน
        {' '}
        <br />
        <br />

        <span className="text-black">{formValues.urgent ? 'ด่วน' : 'ไม่ด่วน'}</span>
      </div>
      {/* <CustomFormField
        form={form}
        name="urgent"
        label={t('Doublecheck.urgent')}
        placeholder={t('Doublecheck.urgent')}
        fieldType="switch"
      /> */}
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
    setQ('');
    // console.log(id, values);
  };

  const cols = columns;

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
        width="max-w-[100%]"
        colum="grid grid-cols-8 gap-8 text-xs"
      />

      {getApi?.isPending ? (
        // <TableLoading />
        <Skeleton />
      ) : getApi?.isError ? (
        toastError(getApi?.error.message)
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
          hasAddp={false}
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
