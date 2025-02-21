import { NextRequest, NextResponse } from 'next/server';

// import { auth } from '@/auth';
import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req:NextRequest) => {
  try {
    // if (req.auth) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    const query = q ? { id: { contains: q, mode: QueryMode.insensitive } } : {};

    // const page = Number.parseInt(searchParams.get('page') as string, 10) || 1;
    // const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 2000;
    // const skip = (page - 1) * pageSize;

    // const [result, total] = await Promise.all([
    //   prisma.basket.findMany({
    //     where: query,
    //     skip,
    //     take: pageSize,
    //     orderBy: { createdAt: 'desc' },
    //   }),
    //   prisma.basket.count({ where: query }),
    // ]);

    // const pages = Math.ceil(total / pageSize);

    // return NextResponse.json({
    //   startIndex: skip + 1,
    //   endIndex: skip + result.length,
    //   count: result.length,
    //   page,
    //   pages,
    //   total,
    //   data: result,
    // });
    // }
    const page = Math.max(1, Number.parseInt(searchParams.get('page') as string, 10) || 1);
    const pageSize = Math.max(1, Number.parseInt(searchParams.get('limit') as string, 10) || 50);
    const skip = (page - 1) * pageSize;

    const [result, total] = await Promise.all([
      prisma.basket.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.basket.count({ where: query }),
    ]);

    const pages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    });
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

// export const POST = async (req:NextRequest) => {
//   try {
//     // if (req.auth) {
//     const {
//       hospitalId,
//       qrCode,
//       basket_color,
//       basket_status,
//       basket_type,
//       basket_floor,
//     } = await req.json();

//     const basketObj = await prisma.basket.create({
//       data: {
//         hospitalId,
//         // userId: 'clyy0oz9a0000w86ie1w2kui1',
//         qrCode,
//         basket_color,
//         basket_status,
//         basket_type,
//         basket_floor: Number(basket_floor),
//       },
//     });

//     return NextResponse.json({
//       basketObj,
//       message: 'Basket has been created successfully',
//     });
//     // }
//     // return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };
