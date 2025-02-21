import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Register',
//   description: `Register at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'สมัครสมาชิก',
    description: 'A I S T',

  };
}
export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='w-full'>{children}</div>
}
