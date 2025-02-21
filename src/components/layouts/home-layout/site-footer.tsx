import Image from 'next/image';
import * as React from 'react';

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 pt-5 text-muted-foreground md:h-24 md:flex-row md:py-5">
      <div className="container flex flex-col items-center justify-between gap-4 py-5 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Image
              src="/pexlleh.svg"
              alt="Logo" // Provide a descriptive alt text
              width={80} // Adjust width as needed
              height={28} // Adjust height as needed (maintain aspect ratio)
              className="h-7 w-5 object-cover object-left" // If you need additional styling
            />
          </div>

          <p className="text-center text-sm leading-loose md:text-left">
            ออกแบบและพัฒนาโดย

            <a
              href="https://www.facebook.com/people/A-I-SMART-TECH/61559957321400"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              บริษัท เอ ไอ สทร์ทเทค จำกัด
            </a>

          </p>
        </div>
      </div>
    </footer>
  );
}
