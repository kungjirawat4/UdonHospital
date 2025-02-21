import { Image } from '@nextui-org/react';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import React, { useState } from 'react';

const ImagePopup: React.FC<{ imageSrc: string; altText: string }> = ({
  imageSrc,
  altText,
}) => {
  const [open, setOpen] = useState(false);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setOpen(true);
    }
  };
  return (
    <>
      {/* Trigger to open the dialog */}
      {/* <div onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        <Image isZoomed width={50} alt={altText} src={imageSrc} />
      </div> */}
      <div
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown} // Add keyboard handler
        role="button" // Assign button role
        tabIndex={0} // Make the div focusable
        style={{ cursor: 'pointer' }}
        aria-label={`Open image: ${altText}`} // Add accessible label
      >
        <Image isZoomed width={100} alt={altText} src={imageSrc} />
      </div>

      {/* Dialog for showing the enlarged image */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center p-0">
          <DialogTitle />
          <div className="relative">
            <Image
              isZoomed
              width={600} // ปรับขนาดตามต้องการ
              height={400} // ปรับขนาดตามต้องการ
              alt={altText}
              src={imageSrc}
            />
            {/* Close button */}
            <button
              type="button" // Explicitly setting type to button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-sm bg-red-600 p-2 text-white"
              aria-label="Close"
            >
              ปิด
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePopup;
