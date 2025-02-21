'use client';

// import {
//   Button,
//   Modal,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
// } from '@nextui-org/react';
// import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import useDataStore from '@/zustand';

import { DataTable } from './_components/data-tabledoublec';
import { FormButton } from './CustomForm';

type Props = {
  form: any;
  loading?: boolean;
  handleSubmit: (data: any) => () => void;
  submitHandler: (data: any) => void;
  label: string;
  height?: string;
  width?: string;
  edit: boolean;
  colum?: string;
  itemDetail?: any;
  // matchingData?: any; // เพิ่ม prop สำหรับรับ matchingData
};

const FormViews = ({
  form,
  loading,
  handleSubmit,
  submitHandler,
  label,
  height,
  width,
  edit,
  colum,
  itemDetail,
  // matchingData, // รับข้อมูล matchingData
}: Props) => {
  const { dialogOpen, setDialogOpen } = useDataStore((state: any) => state);
  // const t = useTranslations();
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [dataAdd, setDataAdd] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/medicine/prescription?q=${itemDetail}`)
      .then(res => res.json())
      .then((data) => {
        setDataEdit(data?.data[0]?.arranged);
        setDataAdd(data?.data[0]?.id);
        // setLoading(false);
      });
  }, [itemDetail]);
  // console.log('form', form);
  // console.log('item', itemDetail);
  // console.log('mdata', matchingData);
  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
      <DialogContent className={`${height} ${width} overflow-hidden`}>
        <DialogHeader>
          <DialogTitle>
            {edit ? 'แก้ไข' : 'เพิ่ม'}
            {' '}
            {label}
          </DialogTitle>
        </DialogHeader>
        {/* <div className="flex flex-col space-y-4 overflow-y-scroll"> */}
        <div className={colum}>{form}</div>
        {dataEdit ? <DataTable data={dataEdit} add={dataAdd} /> : ''}
        <form onSubmit={handleSubmit(submitHandler)} method="dialog">
          <DialogFooter className="mt-4 gap-y-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary" id="dialog-close">
                {'ปิด'}
              </Button>
            </DialogClose>

            <FormButton
              loading={loading}
              type="submit"
              label={edit ? 'บันทึกการแก้ไข' : 'บันทึก'}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormViews;
