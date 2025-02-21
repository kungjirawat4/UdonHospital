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

    const { name, sort, menu, path, description } = await req.json()

    const clientPermissionObj = await prisma.clientPermission.findUnique({
      where: { id: (await params).id },
    })
    if (!clientPermissionObj)
      return getErrorResponse('Client permission not found', 404)

    const checkExistence =
      path &&
      (await params).id &&
      (await prisma.clientPermission.findFirst({
        where: {
          path: path.toLowerCase(),
          id: { not: (await params).id },
        },
      }))
    if (checkExistence)
      return getErrorResponse('Client permission already exist')

    await prisma.clientPermission.update({
      where: { id: (await params).id },
      data: {
        name,
        sort: Number(sort),
        menu,
        description,
        path: path.toLowerCase(),
      },
    })

    return NextResponse.json({
      ...clientPermissionObj,
      message: 'Client permission has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const clientPermissionObj = await prisma.clientPermission.delete({
      where: { id: (await params).id },
    })
    if (!clientPermissionObj)
      return getErrorResponse('Client permission not found', 404)

    return NextResponse.json({
      ...clientPermissionObj,
      message: 'Client permission has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
