import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Roles',
//   description: `List of roles at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'บทบาท',
    description: 'A I S T',

  };
}

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='w-[97%]'>{children}</div>
}
