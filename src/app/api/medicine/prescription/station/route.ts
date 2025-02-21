// import { NextResponse } from 'next/server';

// import { auth } from '@/auth';
// import { getErrorResponse } from '@/libs/helpers';
// import { db } from '@/libs/prisma.db';

// export const GET = auth(async (_req) => {
//   try {
//     // if (req.auth) {
//     const myArray: any = [];
//     const myDetail: any = [];

//     const station = await db.configure.findFirst({
//       where: { hospital_initial: 'UDH' },
//     });

//     if (!station) {
//       return getErrorResponse('Hospital not found', 404);
//     }
//     //    console.log(station.hospital_station);

//     const arrangeds = await db.prescription.findMany({
//       include: {
//         arranged: {
//           include: {
//             medicine: {
//               include: {
//                 cabinet:
//                 {
//                   where: { storage_station: station.hospital_station },

//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     arrangeds.map(async (obj) => {
//       obj.arranged.map(async (arranged) => {
//         const num = arranged?.medicine?.cabinet.length;
//         if (num) {
//           myArray.push(arranged.prescripId);
//           myDetail.push(arranged.medicineId);
//         }
//       });
//     });

//     const master = await db.prescription.findMany({
//       where: { id: { in: myArray } },
//       orderBy: { urgent: 'desc' },
//     });

//     const medicine = await db.arranged.findMany({
//       where: { medicineId: { in: myDetail } },
//       include: {
//         medicine: {
//           include: {
//             cabinet: {
//               where: { storage_station: station.hospital_station },
//             },
//           },
//         },
//       },
//     });

//     return NextResponse.json({
//       data: master,
//       detail: medicine,
//     });
//     // }
//     // return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// });

// import { endOfDay, startOfDay } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

// import { auth } from '@/auth';
import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';

export const GET = async (_req:NextRequest) => {
  // const todayStart = startOfDay(new Date());
  // const todayEnd = endOfDay(new Date());
  try {
    // if (req.auth) {
    const myArray: any = [];
    const myDetail: any = [];

    const station = await prisma.configure.findFirst({
      where: { hospital_initial: 'UDH' },
    });

    if (!station) {
      return getErrorResponse('Hospital not found', 404);
    }
    //    console.log(station.hospital_station);

    const arrangeds = await prisma.prescription.findMany({
      // where: {
      //   autoLoad: {
      //     not: null, // เช็คว่า autoLoad ไม่เป็น null หรือค่าว่าง
      //   },
      // },
      where: {
        prescrip_status: 'กำลังจัดยา',
        // createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
        // createdAt: {
        //   gte: todayStart, // ตั้งแต่เวลาเริ่มต้นของวัน
        //   lte: todayEnd, // จนถึงเวลาสิ้นสุดของวัน
        // },
        autoLoad: {
          not: null, // เช็คว่า autoLoad ไม่เป็น null หรือค่าว่าง
        },
      },
      include: {
        arranged: {
          where: {
            user_arrang_time: null,
          },
          include: {
            autoload: true,
            medicine: {
              include: {
                cabinet:
                {
                  where: { storage_station: station.hospital_station },

                },
              },
            },
          },
        },
      },
    });

    arrangeds.map(async (obj) => {
      obj.arranged.map(async (arranged) => {
        const num = arranged?.medicine?.cabinet.length;
        if (num) {
          myArray.push(arranged.prescripId);
          myDetail.push(arranged.medicineId);
        } else {
          // console.log('arranged.prescripId', arranged.prescripId && arranged.medicine_name);
          // console.log('ALL');
        }
      });
    });

    const master = await prisma.prescription.findMany({
      where: { id: { in: myArray } },
      orderBy: { urgent: 'desc' },
    });

    const medicine = await prisma.arranged.findMany({
      where: { medicineId: { in: myDetail } },
      include: {
        medicine: {
          include: {
            cabinet: {
              where: { storage_station: station.hospital_station },
            },
          },
        },
      },
    });

    return NextResponse.json({
      data: master,
      detail: medicine,
    });
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};
