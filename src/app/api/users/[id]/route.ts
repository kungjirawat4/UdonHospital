import { encryptPassword, getErrorResponse } from '@/libs/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma.db'
import { isAuth } from '@/libs/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: Params) {
  try {
    const role = await prisma.user.findUnique({
      where: {
        id: (await params).id,
      },
      select: {
        role: {
          select: {
            clientPermissions: {
              select: {
                menu: true,
                sort: true,
                path: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!role) return getErrorResponse('Role not found', 404)

    const routes = role.role.clientPermissions

    interface Route {
      menu?: string
      name?: string
      path?: string
      open?: boolean
      sort?: number
    }
    interface RouteChildren extends Route {
      children?: { menu?: string; name?: string; path?: string }[] | any
    }
    const formatRoutes = (routes: Route[]) => {
      const formattedRoutes: RouteChildren[] = []

      routes.forEach((route) => {
        if (route.menu === 'hidden') return null
        if (route.menu === 'profile') return null

        if (route.menu === 'normal') {
          formattedRoutes.push({
            name: route.name,
            path: route.path,
            sort: route.sort,
          })
        } else {
          const found = formattedRoutes.find((r) => r.name === route.menu)
          if (found) {
            found.children.push({ name: route.name, path: route.path })
          } else {
            formattedRoutes.push({
              name: route.menu,
              sort: route.sort,
              open: false,
              children: [{ name: route.name, path: route.path }],
            })
          }
        }
      })

      return formattedRoutes
    }

    const sortMenu: any = (menu: any[]) => {
      const sortedMenu = menu.sort((a, b) => {
        if (a.sort === b.sort) {
          if (a.name < b.name) {
            return -1
          } else {
            return 1
          }
        } else {
          return a.sort - b.sort
        }
      })

      return sortedMenu.map((m) => {
        if (m.children) {
          return {
            ...m,
            children: sortMenu(m.children),
          }
        } else {
          return m
        }
      })
    }

    return NextResponse.json({
      routes,
      menu: sortMenu(formatRoutes(routes) as any[]),
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const { name, status, password, email, roleId } = await req.json()

    const role =
      roleId && (await prisma.role.findFirst({ where: { id: roleId } }))
    if (!role) return getErrorResponse('Role not found', 404)

    const user =
      email &&
      (await params).id &&
      (await prisma.user.findFirst({
        where: { email: email.toLowerCase(), id: { not: (await params).id } },
      }))
    if (user) return getErrorResponse('User already exists', 409)

    const userObj = await prisma.user.update({
      where: { id: (await params).id },
      data: {
        name,
        email: email.toLowerCase(),
        status,
        roleId: role.id,
        ...(password && { password: await encryptPassword(password) }),
      },
    })

    if (!userObj) return getErrorResponse('User not found', 404)

    return NextResponse.json({
      userObj,
      message: 'User has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, await params)

    const userObj =
      (await params).id &&
      (await prisma.user.findFirst({
        where: { id: (await params).id },
        include: {
          role: {
            select: {
              type: true,
            },
          },
        },
      }))
    if (!userObj) return getErrorResponse('User not found', 404)

    if (userObj.role.type === 'SUPER_ADMIN')
      return getErrorResponse('You cannot delete a super admin', 403)

    const userRemove = await prisma.user.delete({
      where: {
        id: userObj.id,
      },
    })

    if (!userRemove) {
      return getErrorResponse('User not removed', 404)
    }

    userObj.password = undefined as any

    return NextResponse.json({
      ...userObj,
      message: 'User removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
