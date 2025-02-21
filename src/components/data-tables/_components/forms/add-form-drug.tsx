import { zodResolver } from '@hookform/resolvers/zod';
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
  medicineFrequencyEn: z.string().min(1),
  medicineAdvice: z.string().min(1),
  // prescripId: z.string().min(1),
  medicinePackageSize: z.string().min(1),
  med_detail: z.string().min(1),
});

export default function AddForm({
  drugId,
  setIsOpen,
}: {
  drugId: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}): React.JSX.Element {
  const postApi = ApiCall({
    key: ['prescription'],
    method: 'POST',
    url: `medicine/prescription/arranged`,
  })?.post;
  // const t = useTranslations('Drug');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineId: drugId?.medicineId ?? '', // fallback to empty string
      medicineAmount: drugId?.medicine_amount ?? 0, // default number
      // medicineMethod: drugId?.medicine_method ?? '',
      // medicineCondition: drugId?.medicine_condition ?? '',
      // medicineUnitEating: drugId?.medicine_unit_eating ?? '',
      medicineFrequencyEn: drugId?.medicineFrequencyEn ?? '',
      medicineAdvice: drugId?.medicine_advice ?? '',
      med_detail: drugId?.med_detail,
      medicinePackageSize: drugId?.medicinePackageSize,
      // prescripId: drugId?.prescripId,
    },
  });

  // console.log('add drug', drugId);
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      postApi?.mutateAsync({ ...values, prescripId: drugId });
      // console.log('postApisusseces', values);
      setIsOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    // console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 px-4 sm:px-0"
      >
        <CustomFormField
          form={form}
          name="medicineId"
          label="ยา"
          placeholder="medicine"
          fieldType="command"
          data={[]}
          key="medicine"
          url="medicine/cabinet-medicine?page=1&limit=3000"
        />
        <CustomFormField
          form={form}
          name="medicineAmount"
          label={'จำนวน'}
          placeholder={'จำนวน'}
          type="number"
        />

        {/* <CustomFormField
          form={form}
          name="medicineMethod"
          label={t('drug_method')}
          placeholder={t('drug_method')}
          type="text"
        />
        <CustomFormField
          form={form}
          name="medicineCondition"
          label={t('drug_condition')}
          placeholder=""
          type="text"
        />

        <CustomFormField
          form={form}
          name="medicineUnitEating"
          label={t('drug_unit')}
          placeholder=""
          type="text"
        />

        <CustomFormField
          form={form}
          name="medicineFrequency"
          label={t('drug_frequency')}
          placeholder=""
          type="text"
        /> */}

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

        <div className="mt-4 flex w-full sm:justify-end">
          <Button
            id="add"
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <>
              {isLoading
                ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      บันทึก...
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
