// import localFont from 'next/font/local'

// export default async function Layout({ children }: LayoutProps) {
//   const myFont = localFont({ src: './fonts/NotoSansThaiLooped-Black.ttf' })
//   return (
//     <div className={myFont.className}>
//       {children}
//       </div>
//   );
// }

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <div>{children}</div>;
}
