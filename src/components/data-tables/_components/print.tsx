/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react/no-array-index-key */
'use client';

// import { Button } from '@nextui-org/react';

import type { Row } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { FaPrint } from 'react-icons/fa6';
import { ReactBarcode } from 'react-jsbarcode';
import QRCode from 'react-qr-code';

import { Button } from '@/components/ui/button';
import usePrint from '@/hooks/use-print'; // Import the custom hook
// import useToasts from '@/hooks/use-toast';

type WithId = {
  id: string;
  prescripId: string;
};

type PrintProps<TData> = {
  row: Row<TData> | any;
};

type PrintContentProps = {
  prints: any;
  datap: any;
  codes: any;
  autoload: any;
  componentRef: React.RefObject<HTMLDivElement>;
};
// const now = new Date();
// const date = now.toLocaleDateString('th-TH'); // หรือ 'en-US' สำหรับภาษาอังกฤษ
// const time = now.toLocaleTimeString('th-TH'); // หรือ 'en-US' สำหรับภาษาอังกฤษ
const now = new Date();
const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
};

const dateTime = now.toLocaleString('th-TH', options);
const PrintContent = ({ prints, datap, componentRef, codes, autoload }: PrintContentProps) => (
  <div
    className="mx-auto h-[60mm] w-[80mm] flex-auto px-[1mm] pb-[5mm] pt-[12mm]"
    ref={componentRef}
  >
    <div className=" justify-center">
      <div className="fixed left-0 top-10 z-10 mt-[-2px] w-full text-[13px]">
        <div className="grid grid-cols-[3fr_1fr_1fr] border-b border-black">
          <div>
            ชื่อ
            {' '}
            {datap?.full_name}
          </div>
          <div>{datap?.hnCode}</div>
          <div className="text-right font-bold">
            {prints?.labelNo}
          </div>
        </div>
      </div>
      <div className="fixed left-0 w-full">

        <div className="col-span-5 row-start-2 mt-4" />

        <div className="flex">
          <div className="overflow-wrap break-word max-w-full grow break-words text-[12px]">
            {prints?.med_detail
              ?.split(',')
              .map((item: any, index: any, array: any) => (
                <React.Fragment key={index}>
                  <div className="mb-[-16px]">
                    {item.trim()}
                  </div>

                  {index < array.length - 1 && <br />}
                </React.Fragment>
              )) || ''}
            <br />
            {prints?.medicine_advice || ''}
          </div>
          <div className="w-1/4 shrink-0">
            {' '}
            {/* ปรับขนาดคอลัมน์ให้มีขนาดเล็กลง */}
            <div className="ml-[27px] mt-[15px] text-[12px]">ข้อมูลยา</div>
            <div className="mt-[5px] flex items-center justify-end">
              <QRCode
                // value={prints?.medicineId || ''}
                value={`https://udh.moph.go.th/show/index.php?img=${codes}`}
                size={55} // ปรับขนาด QR code ให้เหมาะสม

              />
            </div>
          </div>
        </div>

      </div>
      <div className="fixed bottom-0 left-0 z-10 mb-[-10px] mt-[-2px] w-full">
        <div className="border-b border-black">
          <div className="text-[13px] font-bold">
            {/* ยาระบาย แก้ท้องผูก */}
            {prints?.medicineFrequencyEn || ''}
          </div>
        </div>
        <div className="relative flex justify-between">
          <div className="overflow-hidden whitespace-nowrap break-words text-[12px] leading-none">
            <div className="mt-[3px]">
              {prints?.medicine?.medicineName_th || '\u00A0'}
            </div>
            <div className="mt-[5px] font-bold">
              {prints?.medicine?.medicineName_en || prints?.medicine_name || '\u00A0'}
            </div>
          </div>

          <div className="absolute right-0 mt-1 flex h-7 w-14 items-center justify-center border border-black bg-white text-[14px]">
            {prints?.medicine?.cabinet[0]?.HouseId || '\u00A0'}
          </div>
        </div>

        <div className="flex min-h-[48px] w-full justify-between">
          {' '}
          {/* เพิ่ม min-height ที่นี่ */}
          <div className="text-[12px] font-bold">
            <div className="mt-[3px]">
              #
              {prints?.medicine_amount || '\u00A0'}
              {prints?.medicinePackageSize || '\u00A0'}
              {prints?.prod_type || '\u00A0'}

            </div>

            <div>
              {dateTime || '\u00A0'}
              {' '}
              {/* {time || '\u00A0'} */}
            </div>
          </div>

          <div className="mr-[-8px] items-end  bg-transparent">
            <ReactBarcode
              value={`${autoload || '1'}${codes || ''}`}
              options={{
                format: 'CODE128',
                width: 1.5,
                height: 27,
                displayValue: false,
                background: 'rgba(0, 0, 0, 0)',
              }}
              // renderer={Renderer.CANVAS}
            />
          </div>
        </div>
      </div>

    </div>
  </div>
);

export function Print<TData extends WithId>({
  row,
}: PrintProps<TData>) {
  const drugId = row.original.id as string;
  const pId = row.original.prescripId as string;

  const [prints, setDataPrint] = useState<any>(null);
  const [datap, setDatap] = useState<any>(null);
  const [codes, setDatacode] = useState<any>(null);
  const [autoload, setDataautoload] = useState<any>(null);

  const { componentRef, handlePrint } = usePrint(); // Use the custom hook
  useEffect(() => {
    fetch(`/api/medicine/prescription/arranged?q=${drugId}`)
      .then(res => res.json())
      .then((data) => {
        setDataPrint(data?.data[0]);
        setDatacode(data?.data[0].medicine?.medicineCode);
      });
  }, [drugId]);

  useEffect(() => {
    fetch(`/api/medicine/prescription?q=${pId}`)
      .then(res => res.json())
      .then((data) => {
        setDatap(data?.data[0]);
        setDataautoload(data?.data[0]?.autoload[0]?.load_number);
      });
  }, [pId]);
  // console.log('datatap', datap);
  // console.log('prints', prints);
  return (
    <div>
      <div style={{ display: 'none' }}>
        <PrintContent
          prints={prints}
          datap={datap}
          codes={codes}
          autoload={autoload}
          componentRef={componentRef}
        />
      </div>
      <Button onClick={() => handlePrint()} color="primary" className="flex h-8 w-full min-w-32  gap-x-1 rounded-none bg-white px-2 text-sm text-black hover:bg-gray-200">
        <FaPrint className="size-4 text-black" />
        {' '}
        Print Label
      </Button>
    </div>
  );
}
