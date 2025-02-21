

/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { ReactBarcode } from 'react-jsbarcode';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';

import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';

type PrintAllProps = {
  data: any[]; // ข้อมูลที่ส่งเข้ามาเป็น Array
  datap: any;
};

const Autoprint: React.FC<PrintAllProps> = ({ data, datap }) => {
  // const getApi = useApi({
  //   key: ['prescription'],
  //   method: 'GET',
  //   url: `medicine/prescription/station`,
  // })?.get;
  const updateApi = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;

  const componentRef = useRef<HTMLDivElement>(null);
  const [printedIds, setPrintedIds] = useState<Set<string>>(new Set());
  const { toastSuccess } = useToasts();
  // console.log('dataprint', data);
  // console.log('datapprint', datap);
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // อ้างอิงข้อมูลที่จะพิมพ์ทั้งหมด
    // onAfterPrint: () => {
    //   data.forEach((item) => {
    //     updateApi?.mutate({
    //       id: item.id as string, // ใช้ id ของแต่ละรายการที่พิมพ์
    //       print_status: Number(1), // ตั้งสถานะการพิมพ์เป็น 1
    //       barcode: `${item?.autoload?.load_number}${item?.medicine?.medicineCode}`,
    //     });
    //   });
    //   console.log('Print successful');
    // },
    onAfterPrint: async () => {
      const promises = data.map(item =>
        updateApi?.mutateAsync({
          id: item.id as string,
          print_status: Number(1),
          barcode: `${item?.autoload?.load_number}${item?.medicine?.medicineCode}`,
        }),
      );
      await Promise.all(promises);
      // console.log('Print successful');
    },

  });
  useEffect(() => {
    const timer = setTimeout(() => {
      if (componentRef.current && datap?.id) {
        // ตรวจสอบว่ามี ID นี้ใน `printedIds` แล้วหรือไม่
        if (!printedIds.has(datap?.id)) {
          // ดำเนินการพิมพ์
          handlePrint();
          toastSuccess('ปริ้นสำเร็จ');
          // เพิ่ม ID ลงใน `printedIds`
          setPrintedIds(prev => new Set(prev).add(datap?.id));
        } else {
          // console.log(`ID ${datap.id} was already printed.`);
        }
      }
    }, 4000); // รอเวลาให้ DOM โหลดเสร็จ

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datap?.id, printedIds]);

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

  return (
    <div>
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          {data.map((item, index) => (
            <div
              key={index}
              className={`mx-auto h-[60mm] w-[80mm] flex-auto px-[1mm] pb-[5mm] pt-[12mm]`}
              style={{ pageBreakAfter: 'always', overflow: 'hidden' }} // บังคับให้ข้อมูลแต่ละชุดขึ้นหน้าใหม่
            >
              <div className="justify-center">
                <div className="left-0 top-10 z-10 mt-[-2px] w-full text-[13px]">
                  <div className="grid grid-cols-[3fr_1fr_1fr] border-b border-black ">
                    <div className="whitespace-nowrap">
                      ชื่อ
                      {' '}
                      {datap?.full_name}
                    </div>
                    <div>
                      {datap?.hnCode}
                    </div>
                    <div className="text-right font-bold">{item.labelNo}</div>
                  </div>
                </div>
                <div className="left-0 w-full">
                  <div className="flex">
                    <div className="col-span-5 row-start-2" />
                    <div className="overflow-wrap break-word max-w-full grow break-words text-[11px]">
                      {item.med_detail?.split(',').map((detail: string, i: number) => (
                        <div key={i}>{detail.trim()}</div>
                      ))}
                      <p>{item.medicine_advice}</p>
                    </div>

                    <div className="w-1/4 shrink-0">
                      <div className="ml-[27px] mt-[10px] text-[12px]">ข้อมูลยา</div>
                      <div className="mt-[3px] flex items-center justify-end">
                        <QRCode value={`https://udh.moph.go.th/show/index.php?img=${item?.medicine?.medicineCode}`} size={50} />
                      </div>
                    </div>

                  </div>

                </div>

                <div className="bottom-0 left-0 z-10 mb-[-10px] mt-[-2px] w-full">

                  <div className="border-b-[0.5px] border-black">
                    <div className="overflow-hidden whitespace-nowrap break-words text-[12px] font-bold leading-none">
                      {item?.medicineFrequencyEn || '\u00A0'}
                    </div>
                  </div>
                  <div className="relative flex justify-between">
                    <div className="overflow-hidden whitespace-nowrap break-words text-[12px] leading-none">
                      <div className="mt-[3px]">
                        {item?.medicine?.medicineName_th || '\u00A0'}
                      </div>
                      <div className="mt-[3px]">
                        {item?.medicine_name || '\u00A0'}
                      </div>

                    </div>

                    <div className="absolute right-0 mt-1 flex h-7 w-14 items-center justify-center border border-black bg-white text-[14px]">
                      {item?.medicine?.cabinet[0]?.HouseId || '\u00A0'}
                    </div>
                  </div>
                  <div className="flex min-h-[48px] w-full justify-between">
                    {' '}
                    <div className="text-[12px] ">
                      <div className="mt-[2]px font-bold">
                        #
                        {item?.medicine_amount || '\u00A0'}
                        {' '}
                        {item?.medicinePackageSize || '\u00A0'}
                        {' '}
                        {item?.prod_type || '\u00A0'}

                      </div>

                      <div className="mt-[-2px]">
                        {dateTime || '\u00A0'}

                      </div>
                    </div>
                    <p className="mr-[-215px] text-[6px]">

                      {item?.autoload?.load_number}

                      {item?.medicine?.medicineCode}
                    </p>

                    <div className="mr-[-8px] shrink-0  items-end bg-transparent">
                      <ReactBarcode
                        value={`${item?.autoload?.load_number}${item?.medicine?.medicineCode}`}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Autoprint;
