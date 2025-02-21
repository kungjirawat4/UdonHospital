import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import CustomFormField from '@/components/data-tables/CustomForm';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  medicineId: z.string().min(1),
  medicineAmount: z.coerce.number(),
  medicineMethod: z.string().min(1),
  medicineCondition: z.string().min(1),
  medicineUnitEating: z.string().min(1),
  medicineFrequency: z.string().min(1),
  medicineAdvice: z.string().min(1),
});

export default function AddForm({
  drugId,
  setIsOpen,
}: {
  drugId: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}): React.JSX.Element {
  const t = useTranslations('Drug');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicineId: drugId?.medicineId,
      medicineAmount: drugId?.medicine_amount,
      medicineMethod: drugId?.medicine_method,
      medicineCondition: drugId?.medicine_condition,
      medicineUnitEating: drugId?.medicine_unit_eating,
      medicineFrequency: drugId?.medicine_frequency,
      medicineAdvice: drugId?.medicine_advice,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    // eslint-disable-next-line no-console
    console.log(values);
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
          label="medicine"
          placeholder="medicine"
          fieldType="command"
          data={[]}
          key="medicine"
          url="medicine/cabinet-medicine?page=1&limit=1000"
        />
        <CustomFormField
          form={form}
          name="medicineAmount"
          label={t('drug_amount')}
          placeholder={t('drug_amount')}
          type="text"
        />
        <CustomFormField
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
        />

        <CustomFormField
          form={form}
          name="medicineAdvice"
          label={t('drug_advice')}
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
                      Saving...
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
