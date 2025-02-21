import { NextRequest, NextResponse } from 'next/server';

import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';

// type Params = {
//   params: {
//     id: string;
//   };
// };

// export const GET = async (_req: Request, { params }: Params) => {
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    // const queue = await prisma.configure.findFirst();

    const prescriptionLoadObj = await prisma.prescription.findUnique({
      where: { id: id },
      select: {
        id: true,
        basketId: true,
        medicine_total: true,
        queue_num: true,
        queue_type: true,
        createdAt: true,
      },
    });

    if (!prescriptionLoadObj) {
      return getErrorResponse('No prescription found in the system', 500);
    }
    return NextResponse.json(prescriptionLoadObj);
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

// export const PUT = async (req: Request, { params }: Params) => {
//   try {

//     return NextResponse.json({
//       message: 'Basket has been match successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };
