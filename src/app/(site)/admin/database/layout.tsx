import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Databases',
//   description: `List of databases at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'Databases',
    description: 'A I S T',

  };
}
export default function DatabasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='w-[97%]'>{children}</div>
}
