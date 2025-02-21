import FormContainer from '@/components/form-container'
import Navigation from '@/components/navigation'
import Link from 'next/link'
import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

export async function generateMetadata() {

  return {
    title: `error - 404`,
    description: `This page does not exist at ${siteName}.`,
  };
}

export default function NotFound() {
  return (
    <>
      <FormContainer title='404'>
        <h1 className='text-red-500 text-center'>หน้านี้ไม่ได้มีอยู่
       </h1>
        <h2 className='text-red-500 text-center'>
        กรุณากลับไปยังหน้าแรก
        </h2>

        <div className='text-center my-3'>
          <Link href='/medicine' className='btn btn-outline btn-primary'>
          ย้อนกลับ
          </Link>
        </div>
      </FormContainer>
    </>
  )
}
