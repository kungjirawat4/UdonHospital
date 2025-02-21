import { type NextRequest, NextResponse } from 'next/server';

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
    // if (req.auth) {
    const basketObj = await prisma.basket.findUnique({
      where: { basket_status: true, id: id },
      select: {
        id: true,
        basket_color: true,
        basket_type: true,
        basket_floor: true,
        qrCode: true,
      },
    });

    return NextResponse.json(basketObj);
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

