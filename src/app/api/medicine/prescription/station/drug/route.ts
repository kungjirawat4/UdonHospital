import { NextResponse } from 'next/server';

import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';

export const GET = async (_req: Request) => {
  try {
    // if (req.auth) {
    const myArray: any = [];
    const station = await prisma.configure.findFirst({
      where: { hospital_initial: 'UDH' },
    });

    if (!station) {
      return getErrorResponse('Hospital not found', 404);
    }

    const arrangeds = await prisma.prescription.findMany({
      // where: { id: params.id },
      include: {
        arranged: {
          include: {
            medicine: {
              include: {
                cabinet: {
                  where: { storage_station: station.hospital_station },
                },
              },
            },
          },
        },
      },
    });

    arrangeds.map(async (obj) => {
      obj.arranged.map(async (arrang) => {
        const num = arrang?.medicine?.cabinet.length;
        if (num) {
          myArray.push(arrang);
          // console.log('okkk', num, arrang);
        }
      });
    });

    // const medicines = await prisma.medicine.findMany({
    //   where: { id: { in: myArray } },
    // });

    return NextResponse.json({
      data: myArray,
    });
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};
