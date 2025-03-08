'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardBody, CardFooter, Image, Tab, Tabs } from '@nextui-org/react';
import type { Cabinet, Medicine } from '@prisma/client';
// import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { GalleryIcon } from '@/components/common/icons';
import { TopLoadingBar } from '@/components/common/TopLoadingBar';
import CustomFormField, { Upload } from '@/components/custom-form';
import FormView from '@/components/data-tables/FormView';
// import TableLoading from '@/components/data-tables/loading';
import { Form } from '@/components/ui/form';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import useDataStore from '@/zustand';
import ApiCall from '@/services/api';
import Skeleton from '@/components/skeleton';
import useAuthorization from '@/hooks/useAuthorization';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  medicineId: z.string().refine(value => value !== '', {
    message: 'รหัสยาห้ามว่าง',
  }),
  storageMax: z.coerce.number(),
  storageMin: z.coerce.number(),
  storageAdd: z.coerce.number(),
});

const ProdeuctPage = () => {
  // const t = useTranslations();

  const [id, setId] = useState<string | null>(null);
  const [idMed, setIdMed] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [fileLink, setFileLink] = React.useState<string[]>([]);
  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);

  // const breadcrumbItems = [
  //   { title: t('Cabinet.cabinet'), link: '/dashboard/admins/cabinet' },
  // ];
  const { toastError } = useToasts();
  const getApi = ApiCall({
    key: ['cabinet'],
    method: 'GET',
    url: `medicine/product`,
  })?.get;

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

  const getMedicine = ApiCall({
    key: ['medicine'],
    method: 'GET',
    url: `medicine/drug/${idMed}`,
  })?.get;
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
      medicineId: '',
    },
  });

  useEffect(() => {
    if (updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch();
      getMedicine?.refetch();
      setDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateApi?.isSuccess, deleteApi?.isSuccess]);

  useEffect(() => {
    getApi?.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editHandler = (item: Cabinet & { medicine: Medicine }) => {
    setId(item.id!);
    setIdMed(item?.medicine?.id);
    setEdit(true);
    form.setValue('medicineId', item?.medicine?.id);
    form.setValue('storageAdd', item?.medicine?.storageAdd as number);
    form.setValue('storageMax', item?.medicine?.storageMax as number);
    form.setValue('storageMin', item?.medicine?.storageMin as number);
    setFileLink(!getMedicine?.isPending ? [getMedicine?.data?.drugObj[0]] : []);
  };

  const label = 'ตู้ยา';
  // const modal = t('Cabinet.cabinet');

  useEffect(() => {
    if (!dialogOpen) {
      form.reset();
      setEdit(false);
      setId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, fileLink[0]]);

  useEffect(() => {
    getMedicine?.refetch();
    ;
  });

  // console.log(!getMedicine?.isPending ? [getMedicine?.data?.drugObj[0].medicineImage1] : []);

  // eslint-disable-next-line no-console
  console.log('sdfjasdjf', fileLink[0]);

  const formFields = (
    <Form {...form}>
      <CustomFormField
        form={form}
        name="medicineId"
        label="medicineId"
        placeholder="medicineId"
        fieldType="command"
        data={[]}
        key="medicine"
        url="medicine/cabinet-medicine?page=1&limit=5000"
      />

      <Upload
        multiple
        label="Image"
        setFileLink={setFileLink}
        fileLink={fileLink}
        fileType="image"
      // pageType="drug"
      />
      {fileLink.length > 0 && (
        // <div className="mt-2 flex justify-center">
        //   <Image
        //     isZoomed
        //     src={(image1Link as string) || (fileLink?.[0] as string)}
        //     alt="avatar"
        //     width={350}
        //     height={350}
        //     style={{ objectFit: 'cover' }}
        //     // className="rounded-full"
        //   />

        //   <Image
        //     isZoomed
        //     src={(image2Link as string) || (fileLink?.[1] as string)}
        //     alt="avatar"
        //     width={350}
        //     height={350}
        //     style={{ objectFit: 'cover' }}
        //     // className="rounded-full"
        //   />
        //   <Image
        //     isZoomed
        //     src={(image3Link as string) || (fileLink?.[2] as string)}
        //     alt="avatar"
        //     width={350}
        //     height={350}
        //     style={{ objectFit: 'cover' }}
        //     // className="rounded-full"
        //   />

        // </div>
        <div className='avatar text-center flex justify-center items-end mt-2'>
          <div className='w-12 mask mask-squircle'>
            <Image
              src={fileLink?.[0] || null}
              alt='image1'
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
              className='rounded-full'
            />
            <Image
              src={fileLink?.[1] || null}
              alt='image2'
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
              className='rounded-full'
            />
            <Image
              src={fileLink?.[2] || null}
              alt='image3'
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
              className='rounded-full'
            />
          </div>
        </div>
      )}

      <CustomFormField
        form={form}
        name="storageAdd"
        label="เติมยา"
        placeholder="เติมยา"
        type="number"
      // data={size}
      />
      <CustomFormField
        form={form}
        name="storageMax"
        label="จำนวนยาคงเหลือ"
        placeholder="คงเหลือ"
        type="number"
      />
      <CustomFormField
        form={form}
        name="storageMin"
        label="จำนวนยาต่ำสุด"
        placeholder="ยาต่ำสุด"
        type="number"
      />
      {/* <CustomFormField
        form={form}
        name='storage_station'
        label={t('Cabinet.station')}
        placeholder='storage_station'
        type='text'
      />
      <CustomFormField
        form={form}
        name='storage_location'
        label={t('Cabinet.location')}
        placeholder='storage_location'
        type='text'
      />
      <CustomFormField
        form={form}
        name='storage_position'
        label={t('Cabinet.position')}
        placeholder='storage_position'
        type='text'
      />
      <CustomFormField
        form={form}
        name='cabinet_note'
        label={t('Common.note')}
        placeholder='cabinet_note'
        cols={3}
        rows={3}
      /> */}
    </Form>
  );

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?.state?.userInfo?.id;
    updateApi?.mutateAsync({
      id,
      ...values,
      medicineImage1: fileLink[0] ? fileLink[1] : getMedicine?.data?.drugObj[0]?.medicineImage1,
      medicineImage2: fileLink[1] ? fileLink[2] : getMedicine?.data?.drugObj[0]?.medicineImage2,
      medicineImage3: fileLink[2] ? fileLink[3] : getMedicine?.data?.drugObj[0]?.medicineImage3,
      userId:userId,
    });
  };

  const A1 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A1'));
  const A2 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A2'));
  const A3 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A3'));
  const A4 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A4'));
  const A5 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A5'));
  const A6 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A6'));
  const A7 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A7'));
  const A8 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('A8'));

  const B1 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('B1'));
  const B2 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('B2'));
  const B3 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('B3'));
  const B4 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('B4'));
  const B5 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('B5'));
  const B6 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('B6'));
  const B7 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('B7'));

  const C1 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('C1'));
  const C2 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('C2'));
  const C3 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('C3'));
  const C4 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('C4'));
  const C5 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('C5'));
  const C6 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('C6'));

  const D1 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D1'));
  const D2 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D2'));
  const D3 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D3'));
  const D4 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D4'));
  const D5 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D5'));
  const D6 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D6'));
  const D7 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D7'));
  const D8 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D8'));
  const D9 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('D9'));

  const E1 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E1'));
  const E2 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E2'));
  const E3 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E3'));
  const E4 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E4'));
  const E5 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E5'));
  const E6 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E6'));
  const E7 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E7'));
  const E8 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E8'));
  const E9 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('E9'));

  const Z1 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('Z1'));
  const Z2 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('Z2'));
  const Z3 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('Z3'));
  const Z4 = getApi?.data?.data.filter((key: any) => key.storage_location.includes('Z4'));

  return (
    <>
      {/* {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />} */}
      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      <FormView
        form={formFields}
        loading={updateApi?.isPending}
        handleSubmit={form.handleSubmit}
        submitHandler={onSubmit}
        label={label}
        edit={edit}
        width="max-w-[70%]"
      />
      {getApi?.isPending
        ? (
          // <TableLoading />
          <Skeleton />
        )
        : getApi?.isError
          ? (
            toastError(getApi?.error)
          )
          : (
            <div className="flex-1 space-y-4 p-4 pt-6">
              <Tabs color="danger" aria-label="Tabs colors" radius="full" className="w-full">
                <Tab
                  key="A"
                  title={(
                    <div className="flex items-center space-x-2">
                      <GalleryIcon />
                      <span>A zone</span>
                    </div>
                  )}
                >
                  <Tabs aria-label="Options" isVertical>

                    <Tab key="A1" title="A1" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {A1.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_6px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>

                    <Tab key="A2" title="A2" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4">
                        {A2.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="A3" title="A3" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {A3.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="A4" title="A4" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {A4.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="A5" title="A5" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {A5.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="A6" title="A6" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {A6.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="A7" title="A7" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-9 md:grid-cols-9 lg:grid-cols-9">
                        {A7.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="A8" title="A8" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-9 md:grid-cols-9 lg:grid-cols-9">
                        {A8.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                  </Tabs>

                </Tab>
                <Tab
                  key="B"
                  title={(
                    <div className="flex items-center space-x-2">
                      <GalleryIcon />
                      <span>B zone</span>
                    </div>
                  )}
                >
                  <Tabs aria-label="Options" isVertical>
                    <Tab key="B1" title="B1" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {B1.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="B2" title="B2" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {B2.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="B3" title="B3" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {B3.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="B4" title="B4" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {B4.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="B5" title="B5" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {B5.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="B6" title="B6" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {B6.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="B7" title="B7" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {B7.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                  </Tabs>
                </Tab>
                <Tab
                  key="C"
                  title={(
                    <div className="flex items-center space-x-2">
                      <GalleryIcon />
                      <span>C zone</span>
                    </div>
                  )}
                >
                  <Tabs aria-label="Options" isVertical>
                    <Tab key="C1" title="C1" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {C1.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="C2" title="C2" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {C2.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="C3" title="C3" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {C3.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="C4" title="C4" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {C4.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="C5" title="C5" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {C5.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="C6" title="C6" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {C6.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                  </Tabs>
                </Tab>
                <Tab
                  key="D"
                  title={(
                    <div className="flex items-center space-x-2">
                      <GalleryIcon />
                      <span>D zone</span>
                    </div>
                  )}
                >
                  <Tabs aria-label="Options" isVertical>
                    <Tab key="D1" title="D1" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {D1.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D2" title="D2" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {D2.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D3" title="D3" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {D3.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D4" title="D4" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {D4.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D5" title="D5" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {D5.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D6" title="D6" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {D6.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D7" title="D7" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {D7.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D8" title="D8" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {D8.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="D9" title="D9" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {D9.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                  </Tabs>
                </Tab>
                <Tab
                  key="E"
                  title={(
                    <div className="flex items-center space-x-2">
                      <GalleryIcon />
                      <span>E zone</span>
                    </div>
                  )}
                >
                  <Tabs aria-label="Options" isVertical>
                    <Tab key="E1" title="E1" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {E1.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E2" title="E2" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8">
                        {E2.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E3" title="E3" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {E3.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E4" title="E4" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 md:grid-cols-12 lg:grid-cols-12">
                        {E4.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E5" title="E5" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                        {E5.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E6" title="E6" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                        {E6.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E7" title="E7" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                        {E7.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E8" title="E8" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                        {E8.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="E9" title="E9" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
                        {E9.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.HouseId}
                                <br />
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                  </Tabs>

                </Tab>
                <Tab
                  key="Z"
                  title={(
                    <div className="flex items-center space-x-2">
                      <GalleryIcon />
                      <span>Z zone(พักตะกร้า)</span>
                    </div>
                  )}
                >
                  <Tabs aria-label="Options" isVertical>
                    <Tab key="Z1" title="Z1" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {Z1.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>

                    <Tab key="Z2" title="Z2" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {Z2.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="Z3" title="Z3" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {Z3.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                    <Tab key="Z4" title="Z4" className="w-full">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5">
                        {Z4.map((item: any) => (
                          <Card
                            shadow="sm"
                            key={item.id}
                            isPressable
                            onClick={() => {
                              editHandler(item);
                              setDialogOpen(true);
                            }}
                            isFooterBlurred
                            radius="lg"
                            className="border-none"
                          >
                            <CardBody className="overflow-visible p-0">
                              <Image
                                isZoomed
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={`${item.name}`}
                                className="h-[90px] w-full object-cover"
                                src={`${item?.medicine?.medicineImage1 || null}`}
                                loading="lazy"
                              />
                            </CardBody>
                            <CardFooter className="absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10">
                              <p className="text-tiny text-red-600">
                                {item?.medicine?.name}
                              </p>
                            </CardFooter>
                          </Card>

                        ))}
                      </div>
                    </Tab>
                  </Tabs>
                </Tab>
              </Tabs>

            </div>
            // </div>
          )}
    </>
  );
};

export default ProdeuctPage;
