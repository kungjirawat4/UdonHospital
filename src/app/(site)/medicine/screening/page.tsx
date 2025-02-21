'use client';

// import { useTranslations } from 'next-intl';

import BreadCrumb from '@/components/common/breadcrumb';

import MainForm from './main-form';

export default function PerscriptionPage() {
  // const t = useTranslations();
  const breadcrumbItems = [
    { title: 'การคัดกรอง', link: '/medicine/screening' },
  ];
  return (
    <div className="flex w-full flex-col p-6">
      <BreadCrumb items={breadcrumbItems} />
      <MainForm />
    </div>
  );
}
