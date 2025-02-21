import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, Image, Textarea } from '@nextui-org/react';
import { Loader2 } from 'lucide-react';
// import { useTranslations } from 'next-intl';
import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
// import useApi from '@/hooks/useApi';

import CustomFormField from '../../CustomForm';
import ApiCall from '@/services/api';

const formSchema = z.object({
  medicineId: z.string().min(1),
  medicineAmount: z.coerce.number(),
  // medicineMethod: z.string().min(1),
  // medicineCondition: z.string().min(1),
  // medicineUnitEating: z.string().min(1),
  medicineFrequencyEn: z.string(),
  medicineAdvice: z.string(),
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
  // const updateApip = ApiCall({
  //   key: ['prescription'],
  //   method: 'PUT',
  //   url: `medicine/prescription`,
  // })?.put;

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
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [errors, setErrors] = useState({
    error00: drugId?.error00,
    error01: drugId?.error01,
    error02: drugId?.error02,
    error03: drugId?.error03,
    error04: drugId?.error04,
    error05: drugId?.error05,
    error06: drugId?.error06,
    error07: drugId?.error07,
    error08: drugId?.error08,
    error09: drugId?.error09,
    error10: drugId?.error10,
  });
  const [textareaValue, setTextareaValue] = useState(errors.error10 || '');
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.state?.userInfo?.id;
  const updateDatacheck = {
    user_double_check: userId,
    user_check_time: new Date().toISOString()
  };
  // const updateprescrip = {
  //   checkTime: new Date().toISOString(),
  //   userDoubleCheck: userId,
  //   userId: userId

  // };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateApi?.mutateAsync({
        id: drugId.id, // ส่งไอดีเพื่ออัปเดตข้อมูล
        ...values, // ส่งข้อมูลจากฟอร์ม
        ...errors, // ส่งค่าข้อผิดพลาดเป็นตัวอักษรแทน true/false
        ...updateDatacheck,
         error10: textareaValue, // ส่งค่า textarea ไปยัง error10
      });
      // await updateApip?.mutateAsync({
      //   id: drugId.prescripId as string, // อัปเดตข้อมูลโดยใช้ id ของแต่ละรายการ
      //   ...updateprescrip,
      // });
      setIsOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    // console.log('555', values);
  };

  // console.log('eeed', drugId.id);
  const handleCheckboxChange = (
    key: string,
    label: string | boolean,
    checked: boolean | undefined,
  ) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [key]: checked ? label : '', // ส่งข้อความเมื่อตรวจสอบแล้ว
    }));
  };
  const handleTextareaChange = (e: { target: { value: any } }) => {
    setTextareaValue(e.target.value); // อัปเดตค่า textarea
    setErrors(prevErrors => ({
      ...prevErrors,
      error10: e.target.value, // อัปเดต error10
    }));
  };
  // const inputRef = useRef<HTMLInputElement>(null);

  // ทำให้ช่องค้นหาถูกโฟกัสตลอดเวลา
  // useEffect(() => {
  //   const focusInput = () => {
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   };
  //   focusInput();
  //   document.addEventListener('click', focusInput);

  //   // Cleanup event listener เมื่อ component ถูก unmount
  //   return () => {
  //     document.removeEventListener('click', focusInput);
  //   };
  // }, []);
  // console.log('drugedit', drugId);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      // className="flex flex-col space-y-2 px-4 sm:px-0"
      // className="m-5 grid grid-cols-2 gap-8 text-xs justify-center"
      >
        <div className="m-5 grid grid-cols-2 justify-center gap-8 text-sm">
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
            name="medicineFrequencyEn"
            label={'ชื่อเสริม'}
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

        <div className="flex items-center gap-1 pl-10">
          <span className="text-red-500">*</span>
          เหตุผลส่งคืน
        </div>
        <br />
        <div className="grid items-center gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error00 === 'จัดยาใหม่'}
              onChange={e => handleCheckboxChange('error00', 'จัดยาใหม่', e.target.checked)}
            >
              จัดยาใหม่
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error01 === 'จัดยาผิดชนิด'}
              onChange={e => handleCheckboxChange('error01', 'จัดยาผิดชนิด', e.target.checked)}
            >
              จัดยาผิดชนิด
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error02 === 'คีย์ยาผิดชนิด'}
              onChange={e => handleCheckboxChange('error02', 'คีย์ยาผิดชนิด', e.target.checked)}
            >
              คีย์ยาผิดชนิด
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error03 === 'จัดยาผิดจำนวน'}
              onChange={e => handleCheckboxChange('error03', 'จัดยาผิดจำนวน', e.target.checked)}
            >
              จัดยาผิดจำนวน
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error04 === 'คีย์ยาผิดจำนวน'}
              onChange={e => handleCheckboxChange('error04', 'คีย์ยาผิดจำนวน', e.target.checked)}
            >
              คีย์ยาผิดจำนวน
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error05 === 'จัดยาผิดความแรง'}
              onChange={e => handleCheckboxChange('error05', 'จัดยาผิดความแรง', e.target.checked)}
            >
              จัดยาผิดความแรง
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error06 === 'คีย์ยาผิดความแรง'}
              onChange={e => handleCheckboxChange('error06', 'คีย์ยาผิดความแรง', e.target.checked)}
            >
              คีย์ยาผิดความแรง
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error07 === 'ไม่จัดยา'}
              onChange={e => handleCheckboxChange('error07', 'ไม่จัดยา', e.target.checked)}
            >
              ไม่จัดยา
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error08 === 'ไม่คีย์ยา'}
              onChange={e => handleCheckboxChange('error08', 'ไม่คีย์ยา', e.target.checked)}
            >
              ไม่คีย์ยา
            </Checkbox>
          </div>
          <div className="pl-10">
            <Checkbox
              color="danger"
              isSelected={errors.error09 === 'ไม่ยืนยันจัดยา'}
              onChange={e => handleCheckboxChange('error09', 'ไม่ยืนยันจัดยา', e.target.checked)}
            >
              ไม่ยืนยันจัดยา
            </Checkbox>
          </div>
        </div>

        <br />

        <Textarea
          label="อื่นๆ"
          variant="bordered"
          labelPlacement="outside"
          placeholder="กรอกข้อมูล"
          className="col-span-12 mb-6 max-w-[800px] resize-none md:col-span-6 md:mb-0"
          value={textareaValue}
          onChange={handleTextareaChange}
        />
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
