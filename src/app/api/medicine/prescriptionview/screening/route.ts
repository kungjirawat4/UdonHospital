// import { endOfDay, startOfDay } from 'date-fns'; // เพิ่มการ import ฟังก์ชัน date-fns
// import { type NextRequest, NextResponse } from 'next/server';

// import { getErrorResponse } from '@/libs/helpers';
// import { db, QueryMode } from '@/libs/prisma.db';

// export const GET = async (req: NextRequest) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const q = searchParams.get('q');

//     // กำหนดช่วงเวลาวันปัจจุบัน
//     const todayStart = startOfDay(new Date());
//     const todayEnd = endOfDay(new Date());

//     // เพิ่มเงื่อนไขช่วงเวลา createdAt สำหรับวันปัจจุบัน
//     const query = {
//       id: q ? { contains: q, mode: QueryMode.insensitive } : {},
//       createdAt: {
//         gte: todayStart, // ตั้งแต่เวลาเริ่มต้นของวัน
//         lte: todayEnd, // จนถึงเวลาสิ้นสุดของวัน
//       },
//       prescrip_status: {
//         in: ['รอคัดกรอง', 'รอจับคู่ตะกร้า'], // กรองสถานะ 2 ค่า
//       },
//     };

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
//         orderBy: { createdAt: 'asc' },
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
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };

import { endOfDay, startOfDay } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';

import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    // กำหนดช่วงเวลาวันปัจจุบัน
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // เพิ่มเงื่อนไขช่วงเวลา createdAt สำหรับวันปัจจุบัน
    const query = {
      id: q ? { contains: q, mode: QueryMode.insensitive } : {},
      createdAt: {
        gte: todayStart, // ตั้งแต่เวลาเริ่มต้นของวัน
        lte: todayEnd, // จนถึงเวลาสิ้นสุดของวัน
      },
      prescrip_status: {
        in: ['รอคัดกรอง', 'รอจับคู่ตะกร้า','กำลังจัดยา', 'กำลังตรวจสอบ', 'รอเรียกคิว', 'จ่ายยาสำเร็จ','ยกเลิก'], // กรองสถานะ 2 ค่า
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
        orderBy: { createdAt: 'asc' },
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
    // const pageSize = Math.max(1, Number.parseInt(searchParams.get('limit') as string, 10) || 50);
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
    //     orderBy: { createdAt: 'asc' },
    //   }),
    //   prisma.prescription.count({ where: query }),
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
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};
