// import { useRef } from 'react';
// import { useReactToPrint } from 'react-to-print';

// import useToasts from '@/hooks/use-toast';

// const usePrint = () => {
//   const componentRef = useRef<HTMLDivElement>(null);
//   const { toastSuccess, toastWarning } = useToasts();
//   const handlePrint = useReactToPrint({
//     contentRef: componentRef, // ชี้ไปที่ ref ของเนื้อหาที่ต้องการพิมพ์
//     documentTitle: 'My Print Document',
//     onBeforePrint: async () => {
//       toastWarning('Preparing to print...');
//     },
//     onAfterPrint: () => {
//       toastSuccess('บันทึกสำเร็จ');
//     },
//     fonts: [
//       {
//         family: 'NotoSansThaiLooped-Light',
//         source: '/assets/fonts/Noto/NotoSansThaiLooped-Light.ttf', // เส้นทางที่ถูกต้องไปยังฟอนต์
//       },
//     ],
//     pageStyle: `
//       @page {
//         margin: 20mm;
//       }
//       body {
//         font-family: 'NotoSansThaiLooped-Light';
//       }
//     `,
//   });

//   return { componentRef, handlePrint };
// };

// export default usePrint;

// usePrint.js
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import useToasts from '@/hooks/use-toasts';

const usePrint = () => {
  const componentRef = useRef(null);
  const { toastSuccess } = useToasts();
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Prescription Label',
    // onBeforePrint: async () => {
    //   toastWarning('กำลังเตรียมพิมพ์...');
    // },
    onAfterPrint: () => {
      toastSuccess('พิมพ์สำเร็จ');
    },
  });

  return { componentRef, handlePrint };
};

export default usePrint;
