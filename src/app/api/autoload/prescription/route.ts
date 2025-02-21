import { type NextRequest, NextResponse } from 'next/server';


import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';

export const GET = async (_req : NextRequest) => {
  try {
    const prescriptionLoadObj = await prisma.prescription.findFirst({
      // select: {
      //   id: true,
      //   hnCode: true,
      //   basketId: true,
      //   medicine_total: true,
      //   queue_num: true,
      //   queue_type: true,
      //   createdAt: true,
      //   channel: true,
      // },
      take: 1,
      where: {
        // createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
        basketId: null,
        prescrip_status: 'รอจับคู่ตะกร้า',
      },
      orderBy: [{ urgent: 'desc' }, { queue_code: 'asc' }, { createdAt: 'asc' }],
    });

    // console.log(prescriptionLoadObj);

    if (!prescriptionLoadObj) {
      return getErrorResponse('No prescription found in the system', 500);
    }

    const arranged = await prisma.arranged.count({ where: { prescripId: prescriptionLoadObj?.id } });
    if (arranged) {
      await prisma.prescription.update({
        where: { id: prescriptionLoadObj?.id },
        data: { medicine_total: arranged },
      });
    }

    const arrangedCount = await prisma.prescription.findFirst({
      where: { id: prescriptionLoadObj?.id, basketId: null, prescrip_status: 'รอจับคู่ตะกร้า' },
      select: {
        id: true,
        hnCode: true,
        basketId: true,
        medicine_total: true,
        queue_num: true,
        queue_type: true,
        createdAt: true,
        channel: true,
      },
      orderBy: [{ urgent: 'desc' }, { queue_code: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(arrangedCount);
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

