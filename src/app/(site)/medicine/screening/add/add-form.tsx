'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { NextLink } from '@/components/common/link';
import CustomFormField from '@/components/data-tables/CustomForm';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';
import { Button } from '@/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';

const PrescriptionFormSchema = z.object({
  hnCode: z.string(),
  // vnCode: z.string({
  //   required_error: 'Please select an vnCode to display.',
  // }),
  fullName: z.string(),
  queueCode: z.string(),
  queueType: z.string(),
  queueStatus: z.string(),
  // delivery: z.string(),
  // medicineTotal: z.coerce.number(),
  // medicinePrice: z.coerce.number(),
  // urgent: z.coerce.boolean(),
  // queueType: z.string(),
  // medicineTotal: z.coerce.number(),
  // medicinePrice: z.coerce.number(),
  arranged: z
    .array(
      z.object({
        medicineId: z.string(),
        med_detail: z.string(),
        medicine_amount: z.coerce.number(),
        medicinePackageSize: z.string(),
        // medicine_method: z.string(),
        // medicine_condition: z.string(),
        // medicine_unit_eating: z.string(),
        // medicine_frequency: z.string(),
        // medicine_advice: z.string(),
        // medicine_value: z.coerce.number(),
        // medicine_reason: z.string(),
        // medicine_name: z.coerce.date().transform((value) => new Date(value)),
        medicineFrequencyEn: z.string(),
        medicine_advice: z.string(),
      }),
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof PrescriptionFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  hnCode: '',
  // vnCode: '',
  fullName: '',
  queueCode: '',
  queueType: '',
  queueStatus: '',
  // delivery: '',
  // urgent: false,
  // queueNum: '',
  // queueType: '',
  // medicineTotal: 0,
  // medicinePrice: 0,
  arranged: [
    {
      medicineId: '',
      medicine_amount: 0,
      medicinePackageSize: '',
      med_detail: '',
      medicineFrequencyEn: '',
      medicine_advice: '',
      // medicine_condition: '',
      // medicine_unit_eating: '',
      // medicine_frequency: '',
      // medicine_advice: '',
      // medicine_value: 0.0,
      // medicine_reason: '',
    },
  ],
};

export function AddForm() {
  const { toastSuccess, toastWarning } = useToasts();
  const postApi = ApiCall({
    key: ['prescription'],
    method: 'POST',
    url: `medicine/prescription`,
  })?.post;
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(PrescriptionFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({
    name: 'arranged',
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    // ตรวจสอบว่า ฟิลด์ที่จำเป็นต้องกรอก (ยกเว้น queueNum และ queueType) ถูกกรอกข้อมูลครบหรือไม่
    const requiredFields = ['hnCode', 'fullName', 'queueCode'];
    const hasEmptyFields = requiredFields.some(field => !data[field as keyof ProfileFormValues]);

    if (hasEmptyFields) {
      toastWarning('กรุณากรอกข้อมูลที่จำเป็น');
    } else {
      postApi?.mutateAsync(data).then(() => {
        toastSuccess('บันทึกสำเร็จ');
        form.reset(); // เคลียร์ฟอร์มหลังจากการบันทึกสำเร็จ
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="hnCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>hnCode</FormLabel>
                <FormControl>
                  <Input placeholder="HN Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="vnCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>vnCode</FormLabel>
                <FormControl>
                  <Input placeholder="VN Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ สกุล</FormLabel>
                <FormControl>
                  <Input placeholder="ชื่อ สกุล" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="queueType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ประเภทคิว</FormLabel>
                <FormControl>
                  <Input placeholder="ประเภทคิว" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="queueCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>คิวรับบริการ</FormLabel>
                <FormControl>
                  <Input placeholder="คิวรับบริการ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="delivery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Queue Num</FormLabel>
                <FormControl>
                  <Input placeholder="delivery" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* ฟิลด์ queueType แบบ disabled */}
          {/* <FormField
            control={form.control}
            name="queueType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Queue Type</FormLabel>
                <FormControl>
                  <Input placeholder="A, B, C, D" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicineTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จน.จ่าย</FormLabel>
                <FormControl>
                  <Input placeholder="pexlle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicinePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ค่าบริการ+ค่ายา</FormLabel>
                <FormControl>
                  <Input placeholder="pexlle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

        </div>
        <div className="overflow-x-auto">
          <div className="w-full">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="w-auto border border-slate-300">ชื่อยา</th>
                  <th className="w-auto border border-slate-300">ชื่อยาเสริม</th>
                  <th className="w-auto border border-slate-300">จน.จ่าย</th>
                  <th className="w-auto border border-slate-300">หน่วย</th>
                  <th className="w-auto border border-slate-300">วิธีใช้</th>
                  <th className="w-auto border border-slate-300">คำแนะนำ</th>
                  {/* <th className="border border-slate-300">วิธีใช้</th>
                  <th className="border border-slate-300">ครั้งละ</th>
                  <th className="border border-slate-300">หน่วยฯ</th>
                  <th className="border border-slate-300">ความถี่</th>
                  <th className="border border-slate-300">คำสั่ง</th>
                  <th className="border border-slate-300">มูลค่า</th>
                  <th className="border border-slate-300">เหตุผล</th> */}
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <tr>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicineId`}
                          placeholder="medicine"
                          fieldType="command"
                          data={[]}
                          key="medicine"
                          url="medicine/cabinet-medicine?page=1&limit=5000"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicineFrequencyEn`}
                          placeholder="ชื่อยาเสริม"
                          type="text"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_amount`}
                          placeholder="จน.จ่าย"
                          type="number"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicinePackageSize`}
                          placeholder="ขนาดบรรจุ"
                          type="text"
                        />
                      </td>

                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.med_detail`}
                          placeholder="วิธีใช้"
                          type="text"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_advice`}
                          placeholder="คำแนะนำ"
                          type="text"
                        />
                      </td>
                      {/* <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_condition`}
                          placeholder="ครั้งละ"
                          type="text"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_unit_eating`}
                          placeholder="หน่วยรับประทาน"
                          type="text"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_frequency`}
                          placeholder="ความถี่"
                          type="text"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_advice`}
                          placeholder="คำสั่ง"
                          type="text"
                        />
                      </td>
                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_value`}
                          placeholder="มูลค่า"
                          type="number"
                        />
                      </td>

                      <td className="border border-slate-300">
                        <CustomFormField
                          form={form}
                          name={`arranged.${index}.medicine_reason`}
                          placeholder="เหตุผล"
                          type="text"
                        />
                      </td> */}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              append({
                medicineId: '',
                medicine_amount: 0,
                medicinePackageSize: '',
                med_detail: '',
                medicineFrequencyEn: '',
                medicine_advice: '',
                // medicine_method: '',
                // medicine_condition: '',
                // medicine_unit_eating: '',
                // medicine_frequency: '',
                // medicine_advice: '',
                // medicine_value: 0.0,
                // medicine_reason: '',

              })}
          >
            เพิ่มยา
          </Button>
        </div>
        <div className="flex justify-center space-x-4">
          <Button type="submit">บันทึกใบสั่งยา</Button>
          <NextLink href="/medicine/screening">
            <Button color="danger">กลับ</Button>
          </NextLink>
        </div>

      </form>
    </Form>
  );
}
