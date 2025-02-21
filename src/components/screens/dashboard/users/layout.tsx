import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Users',
//   description: `List of users at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'Users',
    description: 'A I S T',

  };
}
export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='w-[97%]'>{children}</div>
}
