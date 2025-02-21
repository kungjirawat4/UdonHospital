import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from '@nextui-org/react';
import { Loader2 } from 'lucide-react';
// import { useTranslations } from 'next-intl';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';
import CustomFormField from '../../CustomForm';

const formSchema = z.object({
  medicineId: z.string().min(1),
  medicineAmount: z.coerce.number(),
  // medicineMethod: z.string().min(1),
  // medicineCondition: z.string().min(1),
  // medicineUnitEating: z.string().min(1),
  medicineFrequencyEn: z.string(),
  medicineAdvice: z.string(),
  medicinePackageSize: z.string().min(1),
  med_detail: z.string(),
});

export default function EditForm({
  drugId,
  setIsOpen,
}: {
  drugId: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}): React.JSX.Element {
  const updateApi = ApiCall({
    key: ['arranged'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;
  // console.log('prescriptions', prescription);
  // console.log('getApi', status1);
  // console.log('data2', drugId?.medicine?.medicineImage1);
  // const t = useTranslations('Drug');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineId: drugId?.medicineId,
      medicineAmount: drugId?.medicine_amount,
      // medicineMethod: drugId?.medicine_method,
      // medicineCondition: drugId?.medicine_condition,
      // medicineUnitEating: drugId?.medicine_unit_eating,
      medicineFrequencyEn: drugId?.medicineFrequencyEn as string || '',
      medicineAdvice: drugId?.medicine_advice as string || '',
      med_detail: drugId?.med_detail as string || '',
      medicinePackageSize: drugId?.medicinePackageSize || '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateApi?.mutateAsync({
        id: drugId.id, // ส่งไอดีเพื่ออัปเดตข้อมูล
        ...values, // ส่งข้อมูลจากฟอร์ม
      });
      setIsOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    // console.log('555', values);
  };

  // console.log('eeed', drugId.id);
  // console.log('drugedit', drugId);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // className="flex flex-col space-y-2 px-4 sm:px-0"
        // className="m-5 grid grid-cols-2 gap-8 text-xs justify-center"
      >
        <div className="m-5 grid grid-cols-2 justify-center gap-8">
          <div className="flex size-52 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {drugId?.medicine?.medicineImage1
            || drugId?.medicine?.medicineImage2
            || drugId?.medicine?.medicineImage3
              ? (
                  <Image
                    isZoomed
                    className="size-[250px] object-cover"
                    alt="Medicine Image"
                    src={
                      drugId?.medicine?.medicineImage1
                      || drugId?.medicine?.medicineImage2
                      || drugId?.medicine?.medicineImage3
                    }
                  />
            // <ImagePopup imageSrc={drugId?.medicine?.medicineImage1} altText="" />
                )
              : (
                  <span className="text-gray-500">No Image</span>
                )}
          </div>
          <CustomFormField
            form={form}
            name="medicineId"
            label="ยา"
            placeholder="medicine"
            fieldType="command"
            data={[]}
            key="medicine"
            url="medicine/cabinet-medicine?page=1&limit=5000"
          />
          <CustomFormField
            form={form}
            name="medicineAmount"
            label={'จำนวน'}
            placeholder={'จำนวน'}
            type="number"
          />
        <CustomFormField
          form={form}
          name="medicinePackageSize"
          label={'ขนาดบรรจุ'}
          placeholder=""
          type="text"
        />
          <CustomFormField
            form={form}
            name="medicineFrequencyEn"
            label={'ชื่อยาเสริม'}
            placeholder=""
            type="text"
          />
          <CustomFormField
            form={form}
            name="med_detail"
            label={'ฉลากยา'}
            placeholder=""
            type="text"
          />
          <CustomFormField
            form={form}
            name="medicineAdvice"
            label={'คำแนะนำ'}
            placeholder=""
            type="text"
          />
        </div>

        <div className="mt-4 flex w-full sm:justify-end">
          <Button
            id="edit"
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <>
              {isLoading
                ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      ยืนยัน...
                    </>
                  )
                : (
                    'Save'
                  )}
            </>
          </Button>
        </div>
      </form>
    </Form>
  );
}
