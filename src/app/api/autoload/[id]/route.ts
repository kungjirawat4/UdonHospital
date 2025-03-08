// import { NextResponse } from 'next/server';

// import { getErrorResponse } from '@/libs/helpers';
// import { prisma } from '@/libs/prisma.db';

// type Params = {
//   params: {
//     id: string;
//   };
// };

// export const GET = async (_req: Request, { params }: Params) => {
//   try {
//     // if (req.auth) {
//     const autoLoadObj = await prisma.autoLoad.findFirst({
//       where: { load_number: Number(params.id) },
//       include: {
//         prescrip: {
//           select: {
//             hnCode: true,
//             vnCode: true,
//             full_name: true,
//             queue_code: true,
//             medicine_total: true,
//             urgent: true,
//           },
//         },
//         basket: {
//           select: {
//             qrCode: true,
//             basket_color: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(autoLoadObj);
//     // }
//     // return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };



import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
  try {
    const autoLoadObj = await prisma.autoLoad.findFirst({
      where: { load_number: Number(id) },
      include: {
        prescrip: {
          select: {
            hnCode: true,
            vnCode: true,
            full_name: true,
            queue_code: true,
            queue_type:true,
            medicine_total: true,
            urgent: true,
          },
        },
        basket: {
          select: {
            qrCode: true,
            basket_color: true,
          },
        },
      },
    });

    return NextResponse.json(autoLoadObj);
  } catch (error: any) {
    return getErrorResponse(error.message, error.status || 500);
  }
}
