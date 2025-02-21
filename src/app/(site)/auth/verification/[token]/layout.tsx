import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Account verification',
//   description: `Account verification at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'Account verification',
    description: 'A I S T',

  };
}

export default function AccountVerificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='w-full h-full'>{children}</div>
}
