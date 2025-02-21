'use client';

// import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import useDataStore from '@/zustand';

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
};

const FormView = ({
  form,
  loading,
  handleSubmit,
  submitHandler,
  label,
  height,
  width,
  edit,
  colum,
}: Props) => {
  const { dialogOpen, setDialogOpen } = useDataStore((state: []) => state);
  // const t = useTranslations();

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
      <DialogContent className={`${height} ${width} overflow-hidden`}>
        <DialogHeader>
          <DialogTitle>
            {edit ? 'แก้ไข' : 'เพิ่มข้อมูล'}
            {' '}
            {label}
          </DialogTitle>
        </DialogHeader>
        {/* <div className="flex flex-col space-y-4 overflow-y-scroll"> */}
        <form onSubmit={handleSubmit(submitHandler)} method="dialog">
          <div className={colum}>{form}</div>
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

export default FormView;
