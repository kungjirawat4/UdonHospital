// import type { FormEvent } from 'react';

// import { Input } from '@/ui/input';

// type Props = {
//   q: string;
//   setQ: (value: string) => void;
//   placeholder: string;
//   searchHandler: (e: FormEvent) => void;
//   type?: string;
// };

// const Search = ({
//   q,
//   setQ,
//   placeholder,
//   searchHandler,
//   type = 'text',
// }: Props) => {
//   return (
//     <form onSubmit={searchHandler}>
//       <div className="flex w-full max-w-sm items-center space-x-2">
//         <Input
//           onChange={e => setQ(e.target.value)}
//           value={q}
//           type={type}
//           placeholder={placeholder}
//           className="h-8"
//         />
//         {/* <Button type='submit'>
//           <FaMagnifyingGlass />
//         </Button> */}
//       </div>
//     </form>
//   );
// };

// export default Search;
// import type { FormEvent } from 'react';
// import React, { useEffect, useRef } from 'react';

// // import { FaMagnifyingGlass } from 'react-icons/fa6';
// import { Input } from '@/ui/input';

// type Props = {
//   q: string;
//   setQ: (value: string) => void;
//   placeholder: string;
//   searchHandler: (e: FormEvent) => void;
//   type?: string;
// };

// const Search = ({
//   q,
//   setQ,
//   placeholder,
//   searchHandler,
//   type = 'text',
// }: Props) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus(); // ทำให้เคอร์เซอร์อยู่ที่ช่องค้นหาทันที
//     }
//   }, []); // ใช้ [] เพื่อให้ `useEffect` ทำงานเพียงครั้งเดียวเมื่อคอมโพเนนต์เรนเดอร์
//   return (
//     <form onSubmit={searchHandler}>
//       <div className="flex w-full max-w-sm items-center space-x-2">
//         {/* <span>
//           <FaMagnifyingGlass />
//         </span> */}
//         <Input
//           ref={inputRef} // ใช้ ref ที่น
//           onChange={e => setQ(e.target.value)}
//           value={q}
//           type={type}
//           placeholder={placeholder}
//           className="h-8"
//         />
//         {/* <Button type='submit'>
//           <FaMagnifyingGlass />
//         </Button> */}
//       </div>
//     </form>
//   );
// };

// export default Search;

import type { FormEvent } from 'react';
import React, { useEffect, useRef } from 'react';

import { Input } from '@/ui/input';

type Props = {
  q: string;
  setQ: (value: string) => void;
  placeholder: string;
  searchHandler: (e: FormEvent) => void;
  type?: string;
};

const Search = ({
  q,
  setQ,
  placeholder,
  searchHandler,
  type = 'text',
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // // ทำให้ช่องค้นหาถูกโฟกัสตลอดเวลา
  // useEffect(() => {
  //   const focusInput = () => {
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   };

  //   // โฟกัสช่องค้นหาเมื่อโหลดหน้าเว็บครั้งแรก
  //   focusInput();

  //   // ฟังเหตุการณ์ focus ของ document เมื่อมีการคลิกที่ใดในหน้าเว็บ
  //   document.addEventListener('click', focusInput);

  //   // Cleanup event listener เมื่อ component ถูก unmount
  //   return () => {
  //     document.removeEventListener('click', focusInput);
  //   };
  // }, []);
  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, [q]); // โฟกัสเมื่อค่าของ `q` เปลี่ยน
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    focusInput();
    document.addEventListener('click', focusInput);

    // Cleanup event listener เมื่อ component ถูก unmount
    return () => {
      document.removeEventListener('click', focusInput);
    };
  }, [q]);
  // useEffect(() => {
  //   const focusInput = () => {
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   };

  //   // ฟังก์ชัน focus จะทำงานแค่ครั้งแรก
  //   focusInput();

  //   // ไม่มีการติดตามการคลิกหลังจากนั้น
  //   return () => {};
  // }, []);

  return (
    <form onSubmit={searchHandler}>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          ref={inputRef}
          onChange={e => setQ(e.target.value)}
          value={q}
          type={type}
          placeholder={placeholder}
          className="h-8"
        />
      </div>
    </form>
  );
};

export default Search;
