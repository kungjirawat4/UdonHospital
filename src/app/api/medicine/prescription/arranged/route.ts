

import { NextRequest, NextResponse } from 'next/server';
// import type { NextAuthRequest } from 'node_modules/next-auth/lib';

// import { auth } from '@/auth';
import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req:NextRequest) => {
  try {
    // if (req.auth) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    const query = q ? { id: { contains: q, mode: QueryMode.insensitive } } : {};

    const page = Number.parseInt(searchParams.get('page') as string, 10) || 1;
    const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 5000;
    const skip = (page - 1) * pageSize;

    const [result, total] = await Promise.all([
      prisma.arranged.findMany({
        where: query,
        include: {
          medicine: {
            include: {
              cabinet: true,
            },
          },
        },

        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.arranged.count({ where: query }),
    ]);

    const pages = Math.ceil(total / pageSize);

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    });
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

// export const POST = auth(async (req: NextAuthRequest) => {
//   try {
//     if (req.auth) {
//       const user: any = await currentUser();
//       const {
//         hnCode,
//         vnCode,
//         queue_code,
//         queue_num,
//         full_name,
//         medicine_total,
//         medicine_price,
//         arranged,
//       } = await req.json();

//       const basketObj = await db.prescription.create({
//         data: {
//           userId: req.auth.user?.id,
//           hospitalId: user.hospital_initial,
//           hnCode,
//           vnCode,
//           queue_code,
//           queue_num,
//           full_name,
//           medicine_total,
//           medicine_price,
//           arranged: {
//             create: arranged,
//           },
//         },
//         include: {
//           arranged: true,
//         },
//       });

//       return NextResponse.json({
//         basketObj,
//         message: 'Med has been created successfully',
//       });
//     }
//     return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// });
// export const POST = async (req: NextRequest) => {
//   try {
//     // if (req.auth) {
//     //   const user: any = await currentUser();
//     const {
//       medicineId,
//       medicineAmount,
//       medicineFrequencyEn,
//       medicineAdvice,
//       med_detail,
//       medicinePackageSize,
//       prescripId,
//     } = await req.json();

//     const basketObj = await prisma.arranged.create({
//       data: {
//         medicineId,
//         medicine_amount: medicineAmount,
//         medicineFrequencyEn,
//         medicine_advice: medicineAdvice,
//         med_detail,
//         medicinePackageSize,
//         prescripId,
//       },
//     });

//     return NextResponse.json({
//       basketObj,
//       message: 'Med has been created successfully',
//     });
//     // }
//     // return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };
