import { isAuth } from '@/libs/auth'
import { encryptPassword, getErrorResponse } from '@/libs/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/libs/prisma.db'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    const query = q
      ? { email: { contains: q, mode: QueryMode.insensitive } }
      : {}

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.user.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          role: {
            select: {
              id: true,
              type: true,
              name: true,
            },
          },
        },
      }),
      prisma.user.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function POST(req: Request) {
  try {
    await isAuth(req)
    const { NEXT_PUBLIC_APP_URL  } = process.env;
    const { name, email, password, status, roleId } = await req.json()

    const role =
      roleId && (await prisma.role.findFirst({ where: { id: roleId } }))
    if (!role) return getErrorResponse('Role not found', 404)

    const user =
      email &&
      (await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      }))
    if (user) return getErrorResponse('User already exists', 409)

    const userObj = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        status,
        roleId: role.id,
        image: `${NEXT_PUBLIC_APP_URL}/udh/avatar.png`,
        password: await encryptPassword({ password }),
      },
    })

    userObj.password = undefined as any

    return NextResponse.json({
      userObj,
      message: 'User has been created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
