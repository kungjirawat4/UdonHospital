import { isAuth } from '@/libs/auth'
import { getErrorResponse } from '@/libs/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma.db'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const userObj = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        idCard: true,
        qrCode: true,
        name: true,
        email: true,
        mobile: true,
        image: true,
        bio: true,
        address: true,
      },
    })

    return NextResponse.json(userObj)
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
