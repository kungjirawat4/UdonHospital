import meta from '@/libs/meta'
import { logo, siteName } from '@/libs/setting'

// export const metadata = meta({
//   title: 'Forgot password',
//   description: `Forgot password at ${siteName}.`,
//   openGraphImage: logo,
// })
export async function generateMetadata() {
  return {
    title: 'ลืมรหัสผ่าน',
    description: 'A I S T',

  };
}
export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
