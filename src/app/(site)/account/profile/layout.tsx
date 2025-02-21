import { MedicineLayout } from '@/components/layouts/medicine-layout'
import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Profile',
//   description: `Profile at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'Profile',
    description: 'A I S T',
    //   description: `Profile at ${siteName}.`,
//   openGraphImage: logo,
  };
}
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MedicineLayout>{children}</MedicineLayout>
}
