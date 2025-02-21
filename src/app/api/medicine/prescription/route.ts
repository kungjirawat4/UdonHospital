// import { type NextRequest, NextResponse } from 'next/server';
// import type { NextAuthRequest } from 'node_modules/next-auth/lib';

// import auth from '@/auth';
// import { currentUser } from '@/libs/auth';
// import { DateLongTH } from '@/libs/dateTime';
// import { getErrorResponse } from '@/libs/helpers';
// import { db, QueryMode } from '@/libs/prisma.db';

// export const GET = async (req: NextRequest) => {
//   try {
//     // if (req.auth) {
//     const { searchParams } = new URL(req.url);
//     const q = searchParams.get('q');

//     const query = q ? { id: { contains: q, mode: QueryMode.insensitive } } : {};

//     const page = Number.parseInt(searchParams.get('page') as string, 10) || 1;
//     const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 3000;
//     const skip = (page - 1) * pageSize;

//     const [result, total] = await Promise.all([
//       db.prescription.findMany({
//         where: query,
//         include: {
//           autoload: true,
//           basket: true,
//           arranged: {
//             include: {
//               medicine: {
//                 include: {
//                   cabinet: true,
//                 },
//               },
//             },
//           },
//         },
//         skip,
//         take: pageSize,
//         orderBy: { createdAt: 'desc' },
//       }),
//       db.prescription.count({ where: query }),
//     ]);

//     const pages = Math.ceil(total / pageSize);

//     return NextResponse.json({
//       startIndex: skip + 1,
//       endIndex: skip + result.length,
//       count: result.length,
//       page,
//       pages,
//       total,
//       data: result,
//     });
//     // }
//     // return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };

// export const POST = auth(async (req: NextAuthRequest) => {
//   try {
//     if (req.auth) {
//       const user: any = await currentUser();
//       const {
//         hnCode,
//         vnCode,
//         queueCode,
//         queueType,
//         fullName,
//         arranged,
//       } = await req.json();

//       const queue: any = await db.configure.findFirst();

//       if (DateLongTH(queue?.hospital_date) !== DateLongTH(new Date())) {
//         await db.configure.update({
//           data: {
//             hospital_date: new Date(),
//             hospital_queue_day: 1,
//           },
//           where: { id: queue?.id },
//         });
//       } else {
//         await db.configure.update({
//           where: { id: queue?.id },
//           data: {
//             hospital_date: new Date(),
//             hospital_queue_day: Number(queue?.hospital_queue_day) + 1,
//           },

//         });
//       }

//       const QueueNum = await db.configure.findFirst();

//       const queueT = queueCode.slice(0, 1);

//       let Qtype: string;
//       if (queueT === 'A' || queueT === 'B' || queueT === 'C' || queueT === 'D' || queueT === 'F') {
//         Qtype = queueT.slice(0, 1);
//       } else {
//         Qtype = queueType;
//       }

//       const prescriptionObj = await db.prescription.create({
//         data: {
//           userId: req.auth.user?.id,
//           hospitalId: user?.hospital_initial,
//           hnCode,
//           vnCode,
//           full_name: fullName,
//           queue_type: Qtype || '',
//           queue_code: queueCode as string,
//           queue_num: String(QueueNum?.hospital_queue_day),
//           // medicine_total: Number(medicineTotal),
//           // medicine_price: Number(medicinePrice),
//           delivery: 'โรงพยาบาล',
//           prescrip_status: 'รอจับคู่ตะกร้า',
//           arranged: {
//             create: arranged,
//           },
//         },
//         include: {
//           arranged: true,
//         },
//       });

//       return NextResponse.json({
//         prescriptionObj,
//         message: 'Prescription has been created successfully',
//       });
//     }
//     return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// });

import { endOfDay, startOfDay } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';
// import type { NextAuthRequest } from 'node_modules/next-auth/lib';

// import auth from '@/auth';
// import { currentUser } from '@/libs/auth';
import { DateLongTH } from '@/libs/dateTime';
import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req: NextRequest) => {
  try {
    // if (req.auth) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    // const query = q ? { id: { contains: q, mode: QueryMode.insensitive } } : {};
    const query = {
      id: q ? { contains: q, mode: QueryMode.insensitive } : {},
      createdAt: {
        gte: todayStart, // ตั้งแต่เวลาเริ่มต้นของวัน
        lte: todayEnd, // จนถึงเวลาสิ้นสุดของวัน
      },

    };

    const page = Number.parseInt(searchParams.get('page') as string, 10) || 1;
    const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 3000;
    const skip = (page - 1) * pageSize;

    const [result, total] = await Promise.all([
      prisma.prescription.findMany({
        where: query,
        include: {
          autoload: true,
          basket: true,
          arranged: {
            include: {
              medicine: {
                include: {
                  cabinet: true,
                },
              },
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.prescription.count({ where: query }),
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
    // const page = Math.max(1, Number.parseInt(searchParams.get('page') as string, 10) || 1);
    // const pageSize = Math.max(1, Number.parseInt(searchParams.get('limit') as string, 10) || 3000);
    // const skip = (page - 1) * pageSize;

    // const [result, total] = await Promise.all([
    //   prisma.prescription.findMany({
    //     where: query,
    //     include: {
    //       autoload: true,
    //       basket: true,
    //       arranged: {
    //         include: {
    //           medicine: {
    //             include: {
    //               cabinet: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //     skip,
    //     take: pageSize,
    //     orderBy: { createdAt: 'desc' },
    //   }),
    //   prisma.prescription.count({ where: query }),
    // ]);

    // const pages = Math.max(1, Math.ceil(total / pageSize));

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
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

// export const POST = async (req: NextRequest) => {
//   try {
//     // if (req.auth) {
//     //   const user: any = await currentUser();
//     const {
//       hnCode,
//       vnCode,
//       queueCode,
//       queueType,
//       fullName,
//       arranged,
//     } = await req.json();

//     const queue: any = await prisma.configure.findFirst();

//     if (DateLongTH(queue?.hospital_date) !== DateLongTH(new Date())) {
//       await prisma.configure.update({
//         data: {
//           hospital_date: new Date(),
//           hospital_queue_day: 1,
//         },
//         where: { id: queue?.id },
//       });
//     } else {
//       await prisma.configure.update({
//         where: { id: queue?.id },
//         data: {
//           hospital_date: new Date(),
//           hospital_queue_day: Number(queue?.hospital_queue_day) + 1,
//         },

//       });
//     }

//     const QueueNum = await prisma.configure.findFirst();

//     const queueT = queueCode.slice(0, 1);

//     let Qtype: string;
//     if (queueT === 'A' || queueT === 'B' || queueT === 'C' || queueT === 'D' || queueT === 'F') {
//       Qtype = queueT.slice(0, 1);
//     } else {
//       Qtype = queueType;
//     }

//     const prescriptionObj = await prisma.prescription.create({
//       data: {
//         // userId: req.auth.user?.id,
//         // hospitalId: user?.hospital_initial,
//         hnCode,
//         vnCode,
//         full_name: fullName,
//         queue_type: Qtype || '',
//         queue_code: queueCode as string,
//         queue_num: String(QueueNum?.hospital_queue_day),
//         // medicine_total: Number(medicineTotal),
//         // medicine_price: Number(medicinePrice),
//         delivery: 'โรงพยาบาล',
//         prescrip_status: 'รอจับคู่ตะกร้า',
//         arranged: {
//           create: arranged,
//         },
//       },
//       include: {
//         arranged: true,
//       },
//     });

//     return NextResponse.json({
//       prescriptionObj,
//       message: 'Prescription has been created successfully',
//     });
//     // }
//     // return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };
