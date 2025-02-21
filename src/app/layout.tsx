import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import Providers from '@/libs/provider'

import { logo, siteName } from '@/libs/setting'
import { Toaster } from '@/components/ui/toaster'
import { TailwindIndicator } from '@/providers/tailwind-indicator'
import { ToastContainer } from 'react-toastify';
import meta from '@/libs/meta'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700', '900'],
})

export const metadata = meta({
  title: {
    default: `${siteName}`,
    template: `%s | ${siteName}`,
  },
  description: `บริษัท เอ ไอ สมาร์ทเทค จำกัด`,
  openGraphImage: logo,
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${roboto.className}`}
        suppressHydrationWarning={true}
      >
        <Providers>

          {children}
          <Toaster />
          <ToastContainer />
          <TailwindIndicator />
        </Providers>

      </body>
    </html>
  )
}
