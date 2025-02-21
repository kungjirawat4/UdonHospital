"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import React from "react";
import useDataStore from "@/zustand/dataStore";
import { FormButton } from "./custom-form";

interface Props {
  form: any;
  loading?: boolean;
  handleSubmit: (data: any) => () => void;
  submitHandler: (data: any) => void;
  label: string;
  height?: string;
  width?: string;
  edit: boolean;
}

const FormView = ({
  form,
  loading,
  handleSubmit,
  submitHandler,
  label,
  height,
  width,
  edit,
}: Props) => {
  const { dialogOpen, setDialogOpen } = useDataStore((state) => state);

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
      <DialogContent className={`${height} ${width} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>
            {edit ? "แก้ไข" : "เพิ่ม"} {label}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} method="dialog">
          {form}
          <DialogFooter className="mt-4 gap-y-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary" id="dialog-close">
                ปิด
              </Button>
            </DialogClose>

            <FormButton
              loading={loading}
              type="submit"
              label={edit ? "บันทึกการเปลี่ยนแปลง" : "บันทึก"}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormView;
