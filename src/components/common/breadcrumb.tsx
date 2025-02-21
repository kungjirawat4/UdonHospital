import { FaChevronRight } from 'react-icons/fa6';
import Link from 'next/link';
// import { useTranslations } from 'next-intl';
import React from 'react';

import { cn } from '@/libs/utils';

type BreadCrumbType = {
  title: string;
  link: string;
};

type BreadCrumbPropsType = {
  items: BreadCrumbType[];
};

export default function BreadCrumb({ items }: BreadCrumbPropsType) {
  // const t = useTranslations('Dashboard');
  return (
    <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/medicine" className="truncate">
        {'หน้าหลัก'}
      </Link>
      {items?.map((item: BreadCrumbType, index: number) => (
        <React.Fragment key={item.title}>
          <FaChevronRight className="size-4" />
          <Link
            href={item.link}
            className={cn(
              'font-medium',
              index === items.length - 1
                ? 'pointer-events-none text-foreground'
                : 'text-muted-foreground',
            )}
          >
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
