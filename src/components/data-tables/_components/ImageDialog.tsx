// import { Image } from '@nextui-org/react';
// import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
// import React, { useState } from 'react';

// const ImagePopup: React.FC<{ imageSrc: string; altText: string }> = ({
//   imageSrc,
//   altText,
// }) => {
//   const [open, setOpen] = useState(false);
//   const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
//     if (event.key === 'Enter' || event.key === ' ') {
//       setOpen(true);
//     }
//   };
//   return (
//     <>
//       {/* Trigger to open the dialog */}
//       {/* <div onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
//         <Image isZoomed width={50} alt={altText} src={imageSrc} />
//       </div> */}
//       <div
//         onClick={() => setOpen(true)}
//         onKeyDown={handleKeyDown} // Add keyboard handler
//         role="button" // Assign button role
//         tabIndex={0} // Make the div focusable
//         style={{ cursor: 'pointer' }}
//         aria-label={`Open image: ${altText}`} // Add accessible label
//       >
//         <Image isZoomed width={50} alt={altText} src={imageSrc} />
//       </div>

//       {/* Dialog for showing the enlarged image */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="fixed inset-0 flex items-center justify-center p-0">
//           <DialogTitle>{altText}</DialogTitle>
//           <div className="relative">
//             <Image
//               isZoomed
//               width={600} // ปรับขนาดตามต้องการ
//               height={400} // ปรับขนาดตามต้องการ
//               alt={altText}
//               src={imageSrc}
//             />
//             {/* Close button */}
//             <button
//               type="button" // Explicitly setting type to button
//               onClick={() => setOpen(false)}
//               className="absolute right-2 top-2 z-10 rounded-sm bg-red-600 p-2 text-white"
//               aria-label="Close"
//             >
//               ปิด
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default ImagePopup;

import { Image } from '@nextui-org/react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@radix-ui/react-dialog';
import React, { useState } from 'react';

const ImagePopup: React.FC<{ imageSrc: string; altText: string }> = ({
  imageSrc,
  altText,
}) => {
  const [open, setOpen] = useState(false);

  // ฟังก์ชันสำหรับเปิดไดอะล็อกด้วยคีย์ Enter หรือ Spacebar
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setOpen(true);
    }
  };

  return (
    <>
      {/* Trigger เพื่อเปิดไดอะล็อก */}
      <div
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="cursor-pointer"
        aria-label={`Open image: ${altText}`}
      >
        <Image isZoomed width={50} alt={altText} src={imageSrc} />
      </div>

      {/* Dialog สำหรับแสดงภาพขยาย */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Overlay สำหรับแบล็กดรอป */}
        <DialogOverlay className="fixed inset-0 z-40  backdrop-blur-sm" />

        <DialogContent
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white shadow-xl">
            <DialogTitle className="sr-only">{altText}</DialogTitle>

            {/* รูปภาพขยาย */}
            <Image
              isZoomed
              width={600}
              height={400}
              alt={altText}
              src={imageSrc}
              className="rounded-lg object-cover"
            />

            {/* ปุ่มปิด */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 z-50 rounded-full bg-red-600 p-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePopup;
