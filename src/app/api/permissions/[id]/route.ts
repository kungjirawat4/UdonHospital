import { isAuth } from '@/libs/auth'
import { getErrorResponse } from '@/libs/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma.db'

interface Params {
  params: Promise<{ id: string }>
}
export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const { name, method, route, description } = await req.json()

    const permissionObj = await prisma.permission.findUnique({
      where: { id: (await params).id },
    })

    if (!permissionObj) return getErrorResponse('Permission not found', 404)

    const checkExistence =
      method &&
      route &&
      (await params).id &&
      (await prisma.permission.findFirst({
        where: {
          method: method.toUpperCase(),
          route: route.toLowerCase(),
          id: { not: (await params).id },
        },
      }))
    if (checkExistence) return getErrorResponse('Permission already exist')

    await prisma.permission.update({
      where: { id: (await params).id },
      data: {
        name,
        method: method.toUpperCase(),
        description,
        route: route.toLowerCase(),
      },
    })

    return NextResponse.json({
      ...permissionObj,
      message: 'Permission has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const permissionObj = await prisma.permission.delete({
      where: { id: (await params).id },
    })

    if (!permissionObj) return getErrorResponse('Permission not removed', 404)

    return NextResponse.json({
      ...permissionObj,
      message: 'Permission has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
