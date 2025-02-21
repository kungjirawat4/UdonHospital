
'use client';

import { use, useEffect, useState } from 'react';

// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';
import { DataTable } from './_components/data-table';

// export default function Page({ params }: { params: { slug: string } }) {
  export default function Page({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = use(paramsPromise); // ใช้ React.use() เพื่อดึงค่า params
  const [dataEdit, setDataEdit] = useState<any>(null);
  const [dataE, setData] = useState<any>(null);
  // const ppp = params.slug;
  const getApi = ApiCall({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription/station`,
  })?.get;
  // console.log('params', ppp);
  // useEffect(() => {
  //   setDataEdit(getApi?.data?.detail);
  // }, [getApi?.data?.detail]);
  useEffect(() => {
    if (getApi?.data?.detail) {
      const filteredData = getApi.data.detail.filter(
        (item: any) => item.prescripId === params.slug,
      );
      const filtered = getApi.data?.data?.filter(
        (item: any) => item.id === params.slug,
      );
      setDataEdit(filteredData);
      // console.log(filtered);
      setData(filtered[0]?.full_name);
    }
  }, [getApi?.data?.data, getApi?.data?.detail, params.slug]);

  // console.log(getApi?.data?.data[0]);
  // console.log('dataStation', dataEdit);
  return (
    <div className="w-full items-center">
      {/* <div>{params.slug}</div> */}
      <div>{dataE}</div>
      {dataEdit ? <DataTable data={dataEdit} id={params.slug} datat={getApi?.data?.data[0]} /> : ''}
    </div>
  );
}
