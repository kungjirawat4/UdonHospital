import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Permissions',
//   description: `List of permissions at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'การอนุญาตสิทธิ์การเข้าถึง',
    description: 'A I S T',

  };
}
export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='w-[97%]'>{children}</div>
}
