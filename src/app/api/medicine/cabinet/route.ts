import { NextRequest, NextResponse } from 'next/server';

// import { auth } from '@/auth';
import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req: NextRequest) => {
  try {
    // if (req.auth) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    const query = q ? { id: { contains: q, mode: QueryMode.insensitive } } : {};

    // const page = Number.parseInt(searchParams.get('page') as string, 10);
    // const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 3000;
    // const skip = (page - 1) * pageSize;

    // const [result, total] = await Promise.all([
    //   prisma.cabinet.findMany({
    //     where: query,
    //     skip,
    //     take: pageSize,
    //     orderBy: { storage_location: 'asc' },
    //     select: {
    //       id: true,
    //       cabinet: true,
    //       HouseId: true,
    //       cabinet_size: true,
    //       mqtt_topic: true,
    //       storage_station: true,
    //       storage_location: true,
    //       storage_position: true,
    //       storage_capacity: true,
    //       userLevel: true,
    //       cabinet_note: true,
    //       plcId: true,
    //       storageMax: true,
    //       storageMin: true,
    //       createdAt: true,
    //       medicine: {
    //         select: {
    //           id: true,
    //           name: true,
    //           medicineImage1: true,
    //           medicineImage2: true,
    //           medicineImage3: true,
    //         },
    //       },
    //     },
    //   }),
    //   prisma.cabinet.count({ where: query }),
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
      prisma.cabinet.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { storage_location: 'asc' },
        select: {
          id: true,
          cabinet: true,
          HouseId: true,
          cabinet_size: true,
          mqtt_topic: true,
          storage_station: true,
          storage_location: true,
          storage_position: true,
          storage_capacity: true,
          userLevel: true,
          cabinet_note: true,
          plcId: true,
          storageMax: true,
          storageMin: true,
          createdAt: true,
          medicine: {
            select: {
              id: true,
              name: true,
              medicineImage1: true,
              medicineImage2: true,
              medicineImage3: true,
            },
          },
        },
      }),
      prisma.cabinet.count({ where: query }),
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
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
  // return Response.json({ message: 'Not authenticated' }, { status: 401 });
}

// export async function POST(req: Request) {
//   try {
//     const {
//       hospitalId,
//       userId,
//       cabinet,
//       house_id,
//       cabinet_size,
//       userLevel,
//       storage_station,
//       storage_location,
//       storage_position,
//       cabinet_note,
//       medicineId,
//       storageMin,
//       storageMax,
//       plcId,
//     } = await req.json();

//     const userObj = await prisma.cabinet.create({
//       data: {
//         hospitalId,
//         userId,
//         mqtt_topic: `UDH/${storage_station}/${storage_location}/${storage_position}`,
//         cabinet,
//         HouseId: house_id as string,
//         cabinet_size,
//         userLevel: userLevel as string,
//         storage_station,
//         storage_location,
//         storage_position,
//         cabinet_note,
//         medicineId: medicineId as string,
//         storageMin: Number(storageMin),
//         storageMax: Number(storageMax),
//         plcId,
//       },
//     });

//     return NextResponse.json({
//       userObj,
//       message: 'Cabinet has been created successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// }
