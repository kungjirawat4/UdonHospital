/* eslint-disable ts/no-unused-expressions */
/* eslint-disable style/multiline-ternary */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from '@nextui-org/react';
import type { Medicine } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// import BreadCrumb from '@/components/common/breadcrumb';
import { TopLoadingBar } from '@/components/common/TopLoadingBar';
import CustomFormField, { Upload } from '@/components/data-tables/CustomForm';
import { DataTable } from '@/components/data-tables/data-table-nofilter';
import FormView from '@/components/data-tables/FormView';
import TableLoading from '@/components/data-tables/loading';
import { Form } from '@/components/ui/form';
import { units } from '@/constants/drug';
// import Message from '@/components/common/Message';
import useToasts from '@/hooks/use-toasts';
import useApi from '@/hooks/useApi';
import useDataStore from '@/zustand';

import { columns } from './columns';
import ApiCall from '@/services/api';
// import { columnsTH } from './columnsTH';

const FormSchema = z.object({
  medicineCode: z.string().refine(value => value !== '', {
    message: 'Code drug is required',
  }),
  medicineName: z.string().refine(value => value !== '', {
    message: 'Durg Name is required',
  }),
  medicineName_en: z.string(),
  // medicine_method: z.string(),
  // medicineMethodEn: z.string(),
  // medicine_condition: z.string(),
  // medicine_unit_eating: z.string(),
  // medicineUnitEatingEn: z.string(),
  // medicine_frequency: z.string(),
  // medicineFrequencyEn: z.string(),
  // medicine_advice: z.string(),
  // medicineAdviceEn: z.string(),
  medicinePackageSize: z.string(),
  medicineNote: z.string().optional(),
});

const Page = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [id, setId] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [q, setQ] = useState('');
  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);
  const [fileLink, setFileLink] = React.useState<string[]>([]);
  const [image1Link, setImage1Link] = React.useState<string | null>(null);
  const [image2Link, setImage2Link] = React.useState<string | null>(null);
  const [image3Link, setImage3Link] = React.useState<string | null>(null);

  // const path = useAuthorization()
  // const router = useRouter()

  // useEffect(() => {
  //   if (path) {
  //     router.push(path)
  //   }
  // }, [path, router])
  const { toastError } = useToasts();
  const getApi = ApiCall({
    key: ['medicine'],
    method: 'GET',
    url: `medicine/drug?page=${page}&q=${q}&limit=${limit}`,
  })?.get;

  const getApiv = ApiCall({
    key: ['medicinev'],
    method: 'GET',
    url: `medicine/drugview?page=${page}&q=${q}`,
  })?.get;

  const postApi = ApiCall({
    key: ['medicine'],
    method: 'POST',
    url: `medicine/drug`,
  })?.post;

  const updateApi = ApiCall({
    key: ['medicine'],
    method: 'PUT',
    url: `medicine/drug`,
  })?.put;

  const deleteApi = ApiCall({
    key: ['medicine'],
    method: 'DELETE',
    url: `medicine/drug`,
  })?.delete;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      medicineCode: '',
      medicineName: '',
      medicineName_en: '',
      medicinePackageSize: '',
      // medicine_method: '',
      // medicineMethodEn: '',
      // medicine_condition: '',
      // medicine_unit_eating: '',
      // medicineUnitEatingEn: '',
      // medicine_frequency: '',
      // medicineFrequencyEn: '',
      // medicine_advice: '',
      // medicineAdviceEn: '',
      medicineNote: '',
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
    setQ('');
    setPage(1);
  };

  const editHandler = (item: Medicine) => {
    setId(item.id!);
    setEdit(true);
    form.setValue('medicineCode', item?.medicineCode);
    form.setValue('medicineName', item?.name as string); // ชื่อยาภาษาไทย
    form.setValue('medicineName', item?.medicineName_th as string); // ชื่อยาภาษาไทย
    // form.setValue('medicineName_en', item?.medicineName_en as string); // ชื่อยาภาษาอังกฤษ
    form.setValue('medicinePackageSize', item?.medicinePackageSize as string); // ขนาดบรรจุ (TAB)
    // form.setValue('medicine_method', item?.medicine_method as string); // วิธีใช้ยา
    // form.setValue('medicineMethodEn', item?.medicineMethodEn as string); // วิธีใช้ยาอังกฤษ
    // form.setValue('medicine_condition', item?.medicine_condition as string); // เงื่อนไขการรับระทาน ครั้งละ
    // form.setValue('medicine_unit_eating', item?.medicine_unit_eating as string); // หน่วยรับทาน
    // form.setValue('medicineUnitEatingEn', item?.medicineUnitEatingEn as string); // หน่วยรับทานอังกฤษ
    // form.setValue('medicine_frequency', item?.medicine_frequency as string); // ความถี่รับทาน
    // form.setValue('medicineFrequencyEn', item?.medicineFrequencyEn as string); // ความถี่รับทาน
    // form.setValue('medicine_advice', item?.medicine_advice as string); // คำแนะนำหรือคำสั่ง
    // form.setValue('medicineAdviceEn', item?.medicineAdviceEn as string); // คำแนะนำหรือคำสั่งอังกฤษ
    form.setValue('medicineNote', item?.medicineNote || '');
    setFileLink(!getApi?.isPending ? [getApi?.data?.data] : []);
    setImage1Link(item?.medicineImage1);
    setImage2Link(item?.medicineImage2);
    setImage3Link(item?.medicineImage3);

    // console.log(getApi?.data?.data[0]);
  };

  const deleteHandler = (id: string) => {
    return deleteApi?.mutateAsync(id);
  };

  const label = 'ยา';
  const modal = 'ยา';

  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEdit(false);
      setId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name="medicineCode"
        label={'รหัสยา'}
        placeholder="Drug Code"
        type="text"
      />
      <div className="columns-2">
        <Upload
          multiple
          label="รูปภาพ"
          setFileLink={setFileLink}
          fileLink={fileLink}
          fileType="image"
          pageType="drug"
        />
        {fileLink.length > 0 && (
          <div className="mt-2 flex justify-center">
            <Image
              isZoomed
              src={(image1Link as string) || (fileLink?.[0] as string)}
              alt="avatar"
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            // className='rounded-full'
            />
            <Image
              isZoomed
              src={(image2Link as string) || (fileLink?.[1] as string)}
              alt="avatar"
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            />
            <Image
              isZoomed
              src={(image3Link as string) || (fileLink?.[2] as string)}
              alt="avatar"
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
      <CustomFormField
        form={form}
        name="medicineName"
        label={'ชื่อยา'}
        placeholder={'ชื่อยา'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="medicineNameEn"
        label={'ชื่อยาภาษาอังกฤษ'}
        placeholder={'ชื่อยาภาษาอังกฤษ'}
        type="text"
      />
      <CustomFormField
        form={form}
        name="medicinePackageSize"
        label={'ขนาดบรรจุยา'}
        placeholder={'ขนาดบรรจุยา'}
        fieldType="command"
        data={units}
      />
      <CustomFormField
        form={form}
        name="medicineNote"
        label={'หมายเหตุ'}
        placeholder="Note"
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
        medicineImage1: fileLink[1] ? fileLink[1] : null,
        medicineImage2: fileLink[2] ? fileLink[2] : null,
        medicineImage3: fileLink[3] ? fileLink[3] : null,
      })
      : postApi?.mutateAsync({
        ...values,
        medicineImage1: fileLink[0] ? fileLink[0] : null,
        medicineImage2: fileLink[1] ? fileLink[1] : null,
        medicineImage3: fileLink[2] ? fileLink[2] : null,
      });
  };

  const breadcrumbItems = [{ title: 'ยา', link: '/medicine/drug' }];
  const cols = columns;

  return (
    <>

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending || postApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
        width="max-w-[70%]"
        colum="grid grid-cols-2 gap-2"
      />

      {getApi?.isPending ? ( // caption='Cabinet List'
        <TableLoading />
      ) : getApi?.isError ? (
        // <Message value={getApi?.error} />
        toastError(getApi?.error)
      ) : (
        <div className="flex-1 space-y-4 p-4 pt-6">
          {/* <BreadCrumb items={breadcrumbItems} /> */}
          <DataTable
            data={getApi?.data}
            datav={getApiv?.data}
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
            hasAddp={false}
          />
        </div>
      )}
    </>
  );
};

export default Page;
