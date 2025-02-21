import { isAuth } from '@/libs/auth'
import { encryptPassword, getErrorResponse } from '@/libs/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma.db'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const { name, address, mobile, bio, image, password } = await req.json()

    const object = await prisma.user.findUnique({
      where: { id: (await params).id },
    })

    if (!object) return getErrorResponse('User profile not found', 404)

    if (password) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (!regex.test(password))
        return getErrorResponse(
          'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character',
          400
        )
    }

    const result = await prisma.user.update({
      where: { id: (await params).id },
      data: {
        ...(password && { password: await encryptPassword({ password }) }),
        name: name || object.name,
        mobile: mobile || object.mobile,
        address: address || object.address,
        image: image || object.image,
        bio: bio || object.bio,
      },
    })

    return NextResponse.json({
      qrCode: result.qrCode,
      idCard: result.idCard,
      name: result.name,
      email: result.email,
      image: result.image,
      mobile: result.mobile,
      message: 'Profile has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
