import { isAuth } from '@/libs/auth'
import { getErrorResponse } from '@/libs/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/libs/prisma.db'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const {
      name,
      permissions: permissionRequest,
      clientPermissions: clientPermissionRequest,
      description,
    } = await req.json()

    let type
    let permission = []
    let clientPermission = []
    if (name) type = name?.toUpperCase().trim().replace(/\s+/g, '_')

    if (permissionRequest) {
      if (Array.isArray(permissionRequest)) {
        permission = permissionRequest
      } else {
        permission = [permissionRequest]
      }
    }

    if (clientPermissionRequest) {
      if (Array.isArray(clientPermissionRequest)) {
        clientPermission = clientPermissionRequest
      } else {
        clientPermission = [clientPermissionRequest]
      }
    }

    permission = permission?.filter((per) => per)
    clientPermission = clientPermission?.filter((client) => client)

    const object = await prisma.role.findUnique({
      where: { id: (await params).id },
    })
    if (!object) return getErrorResponse('Role not found', 400)

    const checkExistence =
      name &&
      type &&
      (await params).id &&
      (await prisma.role.findFirst({
        where: {
          name: { equals: name, mode: QueryMode.insensitive },
          type: { equals: type, mode: QueryMode.insensitive },
          id: { not: (await params).id },
        },
      }))
    if (checkExistence) return getErrorResponse('Role already exist')

    // prepare for disconnect
    const oldPermissions = await prisma.role.findUnique({
      where: { id: (await params).id },
      select: {
        permissions: { select: { id: true } },
        clientPermissions: { select: { id: true } },
      },
    })

    await prisma.role.update({
      where: { id: (await params).id },
      data: {
        name,
        description,
        type,
        permissions: {
          disconnect: oldPermissions?.permissions?.map((pre) => ({
            id: pre.id,
          })),
          connect: permission?.map((pre) => ({ id: pre })),
        },
        clientPermissions: {
          disconnect: oldPermissions?.clientPermissions?.map((client) => ({
            id: client.id,
          })),
          connect: clientPermission?.map((client) => ({ id: client })),
        },
      },
    })

    return NextResponse.json({
      ...object,
      message: 'Role updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const checkIfSuperAdmin = await prisma.role.findUnique({
      where: { id: (await params).id },
    })
    if (checkIfSuperAdmin && checkIfSuperAdmin?.type === 'SUPER_ADMIN')
      return getErrorResponse('Role is super admin', 400)

    const object = await prisma.role.delete({
      where: { id: (await params).id },
    })

    if (!object) return getErrorResponse('Role not found', 404)

    return NextResponse.json({
      ...object,
      message: 'Role deleted successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
