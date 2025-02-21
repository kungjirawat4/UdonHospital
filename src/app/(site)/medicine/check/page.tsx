'use client';

import { useTranslations } from 'next-intl';

import BreadCrumb from '@/components/common/breadcrumb';

import MainForm from './main-form';

export default function Page() {
  // const t = useTranslations();
  const breadcrumbItems = [
    { title: 'ดับเบิลเช็ค', link: '/medicine/check' },
  ];
  return (
    <div className="flex w-full flex-col p-6">
      <BreadCrumb items={breadcrumbItems} />
      <MainForm />
    </div>
  );
}
