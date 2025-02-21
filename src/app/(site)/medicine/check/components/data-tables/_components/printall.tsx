/* eslint-disable react/no-array-index-key */
/* eslint-disable tailwindcss/no-custom-classname */
// /* eslint-disable react/no-array-index-key */
// /* eslint-disable tailwindcss/no-custom-classname */
// import { Button } from '@nextui-org/react';
// import React, { useRef } from 'react';
// import { FaPrint } from 'react-icons/fa';
// import { ReactBarcode } from 'react-jsbarcode';
// import QRCode from 'react-qr-code';
// import { useReactToPrint } from 'react-to-print';

// import { THSarabun } from '@/assets/fonts';
// import useToasts from '@/hooks/use-toast';
// import useApi from '@/hooks/useApi';

// type PrintAllProps = {
//   data: any[]; // ข้อมูลที่ส่งเข้ามาเป็น Array
//   datap: any;
// };

// const PrintAll: React.FC<PrintAllProps> = ({ data, datap }) => {
//   const updateApi = useApi({
//     key: ['prescription'],
//     method: 'PUT',
//     url: `medicine/prescription/arranged`,
//   })?.put;

//   const componentRef = useRef<HTMLDivElement>(null);
//   const { toastSuccess } = useToasts();
//   const handlePrint = useReactToPrint({
//     contentRef: componentRef, // อ้างอิงข้อมูลที่จะพิมพ์ทั้งหมด
//     onAfterPrint: () => {
//       toastSuccess('ปริ้นสำเร็จ'); // ข้อความแจ้งการพิมพ์เสร็จ
//       data.forEach((item) => {
//         updateApi?.mutate({
//           id: item.id, // ใช้ id ของแต่ละรายการที่พิมพ์
//           print_status: 1, // ตั้งสถานะการพิมพ์เป็น 1
//         });
//       });
//     },
//   });
//   // console.log('datatap', datap);
//   return (
//     <div>
//       <Button onClick={() => handlePrint()} color="primary" className="ml-auto capitalize">
//         <FaPrint className="m-1" />
//         Print All
//       </Button>

//       <div style={{ display: 'none' }}>
//         <div ref={componentRef}>
//           {data.map((item, index) => (
//             <div
//               key={index}
//               className={`${THSarabun} mx-auto h-[60mm] w-[80mm] flex-auto px-[1mm] pb-[5mm] pt-[12mm]`}
//               style={{ pageBreakAfter: 'always', overflow: 'hidden' }} // บังคับให้ข้อมูลแต่ละชุดขึ้นหน้าใหม่
//             >
//               <div className="justify-center">
//                 <div className="left-0 top-10 z-10 mt-[-2px] w-full text-[13px]">
//                   <div className="grid grid-cols-[3fr_1fr_1fr] border-b border-black ">
//                     <div>
//                       ชื่อ
//                       {' '}
//                       {datap?.full_name}
//                     </div>
//                     <div>
//                       {datap?.hnCode}
//                     </div>
//                     <div className="text-right font-bold">{item.labelNo}</div>
//                   </div>
//                 </div>
//                 <div className="left-0 w-full">
//                   <div className="flex">
//                     <div className="col-span-5 row-start-2" />
//                     <div className="overflow-wrap break-word max-w-full grow break-words text-[12px]">
//                       {item.med_detail?.split(',').map((detail: string, i: number) => (
//                         <div key={i}>{detail.trim()}</div>
//                       ))}
//                       <p>{item.medicine_advice}</p>
//                     </div>

//                     <div className="w-1/4 shrink-0">
//                       <div className="ml-[27px] mt-[10px] text-[12px]">ข้อมูลยา</div>
//                       <div className="mt-[3px] flex items-center justify-end">
//                         <QRCode value={`https://udh.moph.go.th/show/index.php?img=${item?.medicine?.medicineCode}`} size={55} />
//                       </div>
//                     </div>

//                   </div>

//                 </div>

//                 <div className="bottom-0 left-0 z-10 mb-[-10px] mt-[-2px] w-full">

//                   <div className="border-b-[0.5px] border-black">
//                     <div className="overflow-hidden whitespace-nowrap break-words text-[12px] font-bold leading-none">
//                       {item?.medicineFrequencyEn || '\u00A0'}
//                     </div>
//                   </div>
//                   <div className="relative flex justify-between">
//                     <div className="overflow-hidden whitespace-nowrap break-words text-[12px] leading-none">
//                       <div className="mt-[3px]">
//                         {item?.medicine?.medicineName_th || '\u00A0'}
//                       </div>
//                       <div className="mt-[3px] font-bold">
//                         {item?.medicine?.medicineName_en || item?.medicine_name || '\u00A0'}
//                       </div>

//                     </div>

//                     <div className="absolute right-0 mt-1 flex h-7 w-14 items-center justify-center border border-black bg-white text-[14px]">
//                       {item?.medicine?.cabinet[0]?.HouseId || '\u00A0'}
//                     </div>
//                   </div>
//                   <div className="flex min-h-[48px] w-full justify-between">
//                     {' '}
//                     <div className="text-[12px] font-bold">
//                       <div className="mt-[2px]">
//                         #
//                         {item?.medicine_amount || '\u00A0'}
//                         {item?.medicinePackageSize || '\u00A0'}
//                         {item?.prod_type || '\u00A0'}

//                       </div>

//                       <div className="mt-[-2px]">
//                         {new Date().toLocaleDateString('th-TH') || '\u00A0'}

//                       </div>
//                     </div>
//                     <p className="mr-[-225px] text-[6px]">

//                       {item?.autoload?.load_number || '0'}

//                       {item?.medicine?.medicineCode}
//                     </p>
//                     <div className="mt-[-20px]items-end mr-[-8px]  bg-transparent">
//                       <ReactBarcode
//                         value={`${item?.autoload?.load_number || '0'}${item?.medicine?.medicineCode}`}
//                         options={{
//                           format: 'CODE128',
//                           width: 1.5,
//                           height: 27,
//                           // displayValue: false,
//                           background: 'rgba(0, 0, 0, 0)',
//                         }}
//                         // renderer={Renderer.CANVAS}
//                       />
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrintAll;

import { Button } from '@nextui-org/react';
import React, { useRef } from 'react';
import { FaPrint } from 'react-icons/fa';
import { ReactBarcode } from 'react-jsbarcode';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';

// import { THSarabun } from '@/assets/fonts';
import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';

type PrintAllProps = {
  data: any[]; // ข้อมูลที่ส่งเข้ามาเป็น Array
  datap: any;
};

const PrintAll: React.FC<PrintAllProps> = ({ data, datap }) => {
  const updateApi = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;

  const componentRef = useRef<HTMLDivElement>(null);
  const { toastSuccess } = useToasts();
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // อ้างอิงข้อมูลที่จะพิมพ์ทั้งหมด
    onAfterPrint: () => {
      toastSuccess('ปริ้นสำเร็จ'); // ข้อความแจ้งการพิมพ์เสร็จ
      data?.forEach((item) => {
        updateApi?.mutate({
          id: item.id as string, // ใช้ id ของแต่ละรายการที่พิมพ์
          print_status: Number(1), // ตั้งสถานะการพิมพ์เป็น 1
          barcode: `${item?.autoload?.load_number}${item?.medicine?.medicineCode}`,
        });
      });
    },
  });
  // console.log('datatap', datap);
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
      {/* <Button onClick={() => handlePrint()} color="primary" className="ml-auto capitalize"> */}
      <Button onClick={() => handlePrint()} color="primary" className="flex h-8 w-full min-w-32  gap-x-1 rounded-none bg-white px-2 text-sm text-black hover:bg-gray-200">
        {/* <FaPrint className="m-1" /> */}
        <FaPrint className="size-4 text-black" />
        Print All
      </Button>

      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          {data?.map((item, index) => (
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
                    <div className="text-[12px] font-bold leading-none">
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
                      <div className="mt-[2px] font-bold">
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
                    <p className="mr-[-225px] text-[6px]">

                      {item?.autoload?.load_number || '0'}

                      {item?.medicine?.medicineCode}
                    </p>
                    <div className="mt-[-20px]items-end mr-[-8px]  bg-transparent">
                      <ReactBarcode
                        value={`${item?.autoload?.load_number || '0'}${item?.medicine?.medicineCode}`}
                        options={{
                          format: 'CODE128',
                          width: 1.5,
                          height: 27,
                          // displayValue: false,
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

export default PrintAll;
