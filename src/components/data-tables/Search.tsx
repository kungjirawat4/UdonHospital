

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
  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, [q]); // โฟกัสเมื่อค่าของ `q` เปลี่ยน

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     inputRef.current?.focus(); // โฟกัสที่ช่อง Input ทุกๆ 3 วินาที
  //   }, 5000);

  //   // เคลียร์ interval เมื่อคอมโพเนนต์ถูก unmount
  //   return () => clearInterval(interval);
  // }, []); // รัน useEffect ครั้งเดียวหลังจากเรนเดอร์ครั้งแรก
  useEffect(() => {
    const interval = setInterval(() => {
      if (inputRef.current?.id === 'search-input') {
        inputRef.current.focus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <form onSubmit={searchHandler}>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          id="search-input"
          ref={inputRef}
          onChange={e => setQ(e.target.value)}
          value={q}
          type={type}
          placeholder={'ค้นหา'}
          className="h-8"
        />
      </div>
    </form>
  );
};

export default Search;
