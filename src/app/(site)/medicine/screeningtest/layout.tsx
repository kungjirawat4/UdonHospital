export async function generateMetadata() {

  return {
    title: 'Screening',
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
