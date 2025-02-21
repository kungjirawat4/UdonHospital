// /* eslint-disable style/multiline-ternary */
// /* eslint-disable ts/no-unused-expressions */
// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import type { Prescription } from '@prisma/client';
// import { useLocale, useTranslations } from 'next-intl';
// import type { FormEvent } from 'react';
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';

// import { TopLoadingBar } from '@/components/common/TopLoadingBar';
// // import CustomFormField from '@/components/data-tables/CustomForm';
// import { DataTable } from '@/components/data-tables/data-table';
// import FormViews from '@/components/data-tables/FormViewsdoublec';
// import TableLoading from '@/components/data-tables/loading';
// import { Form } from '@/components/ui/form';
// import useToasts from '@/hooks/use-toast';
// import useApi from '@/hooks/useApi';
// import useDataStore from '@/zustand';

// import { columns } from './columns';
// import { columnsTH } from './columnsTH';
// import { delivery_options, status_options, type_options } from './filters';

// const FormSchema = z.object({
//   hnCode: z
//     .string()
//     .min(2, {
//       message: 'hnCode must be at least 2 characters.',
//     })
//     .max(30, {
//       message: 'hnCode must not be longer than 30 characters.',
//     }),
//   vnCode: z.string({
//     required_error: 'Please select an vnCode to display.',
//   }),
//   fullName: z.string(),
//   queueCode: z.string(),
//   queueNum: z.string(),
//   queueType: z.string(),
//   queueStatus: z.string(),
//   delivery: z.string(),
//   medicineTotal: z.coerce.number(),
//   medicinePrice: z.coerce.number(),
//   urgent: z.coerce.boolean(),
// });

// const MainForm = () => {
//   const t = useTranslations();
//   const locale = useLocale();
//   const [page, setPage] = useState(1);
//   const [limit] = useState(50);
//   const [id, setId] = useState<string | null>(null);
//   const [idEdit, setIdEdit] = useState<string | null>(null);
//   const [edit, setEdit] = useState(false);
//   const [q, setQ] = useState('');
//   const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);
//   const [matchingData, setMatchingData] = useState<any>(null); // กำหนด state สำหรับ matchingData
//   const { toastError, toastWarning } = useToasts();
//   const getApi = useApi({
//     key: ['prescription'],
//     method: 'GET',
//     url: `medicine/prescription?page=${page}&q=${q}&limit=${limit}`,
//   })?.get;

//   const postApi = useApi({
//     key: ['prescription'],
//     method: 'POST',
//     url: `medicine/prescription`,
//   })?.post;

//   const updateApi = useApi({
//     key: ['prescription'],
//     method: 'PUT',
//     url: `medicine/prescription`,
//   })?.put;

//   const deleteApi = useApi({
//     key: ['prescription'],
//     method: 'DELETE',
//     url: `medicine/prescription`,
//   })?.deleteObj;

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       hnCode: '',
//       vnCode: '',
//       fullName: '',
//       queueCode: '',
//       queueNum: '',
//       queueType: '',
//       queueStatus: '',
//       delivery: '',
//       medicineTotal: 0,
//       medicinePrice: 0,
//       urgent: false,
//     },
//   });

//   useEffect(() => {
//     if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
//       getApi?.refetch();
//       setDialogOpen(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess]);

//   useEffect(() => {
//     getApi?.refetch();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   useEffect(() => {
//     if (!q) {
//       getApi?.refetch();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q]);

//   const check = getApi?.data;
//   const dataArray = Array.isArray(check?.data) ? check.data : [];
//   // console.log('Data Array:', dataArray);

//   // ฟังก์ชันสำหรับค้นหาข้อมูลที่ตรงกับ q
//   // const findMatchingData = (query: string, data: any[]) => {
//   //   return data.filter(item =>
//   //     Object.values(item).some(
//   //       value => typeof value === 'string' && value.includes(query),
//   //     ),
//   //   );
//   // };

//   const findMatchingData = (query: string, data: any[]) => {
//     const searchInObject = (obj: any): boolean => {
//       return Object.values(obj).some((value) => {
//         if (typeof value === 'string') {
//           return value === query; // ใช้ === เพื่อให้ตรงกันทั้งหมด
//         }
//         if (typeof value === 'object' && value !== null) {
//           return searchInObject(value); // ค้นหาใน object ที่ซ้อนกัน
//         }
//         return false;
//       });
//     };

//     return data.filter(item => searchInObject(item));
//   };
//   const searchHandler = (e: FormEvent) => {
//     e.preventDefault();
//     if (!q || q.length < 2) {
//       toastWarning('กรุณากรอกข้อมูล');
//       setQ('');
//       return;
//     }
//     // ค้นหาข้อมูลที่ตรงกับ q
//     const matchingDatam = findMatchingData(q, dataArray);
//     // แสดงข้อมูลที่ตรงกันใน log
//     // console.log('Matching Data:', matchingDatam); // ตรวจสอบข้อมูลที่ค้นหา
//     if (matchingDatam.length > 0
//     // && q.length === 25
//     ) {
//       if (matchingDatam[0].prescrip_status === 'กำลังตรวจสอบ') {
//         setDialogOpen(true);
//         // setMatchingData(matchingDatam[0]);
//         setMatchingData({ ...matchingDatam[0] }); // ทำการคัดลอกข้อมูลใหม่

//         // console.log('matchingData:', matchingData);
//         getApi?.refetch();
//       } else {
//         // alert('ไม่พบข้อมูล');
//         toastWarning('ไม่พบข้อมูล');
//       }
//     } else {
//       // console.log('No matching data found.');
//       toastWarning('ไม่พบข้อมูล');
//     }
//     setQ('');
//     getApi?.refetch();
//     setPage(1);
//     // console.log('qqq', q);
//   };

//   useEffect(() => {
//     // console.log('Matching Data in useEffect:', matchingData);
//     if (matchingData) {
//       setId(matchingData.id!);
//       setEdit(true);

//       // form.reset(matchingData); // หรือ setValue ถ้าต้องการ
//       form.setValue('hnCode', matchingData?.hnCode as string);
//       form.setValue('vnCode', matchingData?.vnCode as string);
//       form.setValue('fullName', matchingData?.full_name as string);
//       form.setValue('queueCode', matchingData?.queue_code as string);
//       form.setValue('queueNum', matchingData?.queue_num as string);
//       form.setValue('queueType', matchingData?.queue_type as string);
//       form.setValue('queueStatus', matchingData?.prescrip_status as string);
//       form.setValue('delivery', matchingData?.delivery as string);
//       form.setValue('medicineTotal', Number(matchingData?.medicine_total));
//       form.setValue('medicinePrice', Number(matchingData?.medicine_price));
//       form.setValue('urgent', Boolean(matchingData?.urgent));
//       setIdEdit(matchingData.id!);
//       // console.log('Form after update:', form.getValues()); // ตรวจสอบค่าในฟอร์มหลังอัปเดต
//     }
//   }, [matchingData, form]);

//   const editHandler = (item: Prescription) => {
//     setId(item.id!);
//     setEdit(true);
//     form.setValue('hnCode', item?.hnCode as string);
//     form.setValue('vnCode', item?.vnCode as string);
//     form.setValue('fullName', item?.full_name as string);
//     form.setValue('queueCode', item?.queue_code as string);
//     form.setValue('queueNum', item?.queue_num as string);
//     form.setValue('queueType', item?.queue_type as string);
//     form.setValue('queueStatus', item?.prescrip_status as string);
//     form.setValue('delivery', item?.delivery as string);
//     form.setValue('medicineTotal', Number(item?.medicine_total));
//     form.setValue('medicinePrice', Number(item?.medicine_price));
//     form.setValue('urgent', Boolean(item?.urgent));
//     setIdEdit(item.id!);
//   };

//   const deleteHandler = (id: string) => {
//     return deleteApi?.mutateAsync(id);
//   };

//   const label = t('Prescription.prescription');
//   const modal = t('Prescription.prescription');

//   useEffect(() => {
//     if (!dialogOpen) {
//       form.reset();
//       setEdit(false);
//       setId(null);
//       setIdEdit(null);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dialogOpen]);

//   const filterTitle2 = t('Prescription.status') as string;
//   const filterTitle1 = t('Prescription.queue_type') as string;
//   const filterTitle3 = t('Prescription.delivery') as string;

//   const formValues = form.getValues(); // ดึงค่าทั้งหมดจากฟอร์ม

//   const formFields = (
//     <Form {...form}>
//       <div className=" grid grid-cols-7 gap-7 space-y-4 rounded-md bg-white p-4 text-xs shadow-md">
//         {/* ข้อมูลผู้ป่วย */}

//         <p className="font-semibold">
//           {t('Prescription.name')}
//           :
//           {' '}
//           <span className="text-gray-600">{formValues.fullName}</span>
//         </p>
//         <p className="font-semibold">
//           {t('Prescription.hn')}
//           :
//           {' '}
//           <span className="text-gray-600">{formValues.hnCode}</span>
//         </p>

//         {/* ข้อมูลคิว */}

//         <p className="font-semibold">
//           {t('Prescription.queue_type')}
//           :
//           {' '}
//           <span className="text-gray-600">{formValues.queueType}</span>
//         </p>
//         <p className="font-semibold">
//           {t('Prescription.queue')}
//           :
//           {' '}
//           <span className="text-gray-600">{formValues.queueCode}</span>
//         </p>
//         {/* สถานะการจอง */}
//         <p className="font-semibold">
//           {t('Prescription.queue_type')}
//           :
//           {' '}
//           <span className="text-gray-600">{formValues.queueStatus}</span>
//         </p>

//         {/* ข้อมูลการจัดส่ง */}
//         <p className="font-semibold">
//           {t('Prescription.delivery')}
//           :
//           {' '}
//           <span className="text-gray-600">{formValues.delivery}</span>
//         </p>

//         {/* ค่ารักษาพยาบาล */}

//         <p className="font-semibold">
//           {t('Prescription.amount')}
//           :
//           {' '}
//           <span className="text-gray-600">{formValues.medicineTotal}</span>
//         </p>

//         {/* ความเร่งด่วน */}
//         <p className="font-semibold">
//           {t('Prescription.urgent')}
//           :
//           {' '}
//           <span className="text-red-600">{formValues.urgent}</span>
//         </p>
//       </div>
//     </Form>
//   );
//   const onSubmit = (values: z.infer<typeof FormSchema>) => {
//     edit
//       ? updateApi?.mutateAsync({
//         id,
//         ...values,
//       })
//       : postApi?.mutateAsync(values);

//     // console.log(id, values);
//   };
//   const cols = locale === 'en' ? columns : columnsTH;
//   return (
//     <>
//       <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

//       <FormViews
//         form={formFields}
//         loading={updateApi?.isPending || postApi?.isPending}
//         handleSubmit={form.handleSubmit}
//         submitHandler={onSubmit}
//         label={label}
//         edit={edit}
//         itemDetail={idEdit}
//         // matchingData={matchingData} // ส่งข้อมูล matchingData ไปใน FormViews1
//         width="max-w-[70%]"
//         colum="m-5 grid grid-cols-1 gap-1 text-sm justify-center"
//       />
//       {getApi?.isPending ? ( // caption='Cabinet List'
//         <TableLoading />
//       ) : getApi?.isError ? (
//         // <Message value={getApi?.error} />
//         toastError(getApi?.error.message)
//       ) : (
//         // <div className="flex-1 space-y-4 p-4 pt-">
//         <DataTable
//           data={getApi?.data}
//           columns={cols({
//             editHandler,
//             isPending: deleteApi?.isPending || false,
//             deleteHandler,
//           })}
//           setPage={setPage}
//           // setLimit={setLimit}
//           limit={limit}
//           q={q}
//           setQ={setQ}
//           searchHandler={searchHandler}
//           modal={modal}
//           hasAdd={false}
//           filter1="queue_type"
//           filterTitle1={filterTitle1}
//           option1={type_options}
//           filter2="prescrip_status"
//           filterTitle2={filterTitle2}
//           option2={status_options}
//           filter3="delivery"
//           filterTitle3={filterTitle3}
//           option3={delivery_options}
//         />
//         // </div>
//       )}
//     </>
//   );
// };

// export default MainForm;
