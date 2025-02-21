// import { NextResponse } from 'next/server';

// import { getErrorResponse } from '@/libs/helpers';
// import { db } from '@/libs/prisma.db';

// type Params = {
//   params: {
//     id: string;
//   };
// };

// export async function PUT(req: Request, { params }: Params) {
//   try {
//     const {
//       medicineId,
//       medicineAmount,
//       medicineMethod,
//       medicineCondition,
//       medicineUnitEating,
//       medicineFrequency,
//       medicineAdvice,
//     } = await req.json();

//     // console.log(medicineImage1);

//     const ArrangedObj = await db.arranged.findUnique({
//       where: { id: params.id },
//     });
//     if (!ArrangedObj) {
//       return getErrorResponse('Drug not found', 404);
//     }

//     await db.arranged.update({
//       where: { id: params.id },
//       data: {
//         medicineId,
//         medicine_amount: medicineAmount,
//         medicine_method: medicineMethod,
//         medicine_condition: medicineCondition,
//         medicine_unit_eating: medicineUnitEating,
//         medicine_frequency: medicineFrequency,
//         medicine_advice: medicineAdvice,
//       },
//     });

//     return NextResponse.json({
//       ...ArrangedObj,
//       message: 'Arranged has been updated successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// }

// export async function DELETE(_req: Request, { params }: Params) {
//   try {
//     const ArrangedObj = await db.arranged.delete({
//       where: { id: params.id },
//     });
//     if (!ArrangedObj) {
//       return getErrorResponse('Drug not found', 404);
//     }

//     return NextResponse.json({
//       ...ArrangedObj,
//       message: 'Arranged has been removed successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// }

import { type NextRequest, NextResponse } from 'next/server';

import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';
// import { auth } from '@/auth';
// import { orderBy, result } from 'lodash';

// type Params = {
//   params: {
//     id: string;
//   };
// };
// export const GET = async (_req: NextRequest, { params }: Params) => {
  export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id
  try {
    // if (req.auth) {

    const [result] = await Promise.all([
      prisma.arranged.findMany({
        where: { id: id },
        include: {
          medicine: {
            include: {
              cabinet: true,
            },
          },
        },

        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      data: result,
    });
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};
// export async function PUT(req: Request, { params }: Params) {
//   try {
//     const {
//       medicineId,
//       medicineAmount,
//       medicineMethod,
//       medicineCondition,
//       medicineUnitEating,
//       medicineFrequency,
//       medicineAdvice,
//       arrang_status,
//       print_status,
//       barcode,
//       error00,
//       error01,
//       error02,
//       error03,
//       error04,
//       error05,
//       error06,
//       error07,
//       error08,
//       error09,
//       error10,
//       checkComment,
//       user_arrang,
//       user_arrang_time,
//       user_check_time,
//     } = await req.json();

//     // console.log(medicineImage1);

//     const ArrangedObj = await prisma.arranged.findUnique({
//       where: { id: params.id },
//     });
//     if (!ArrangedObj) {
//       return getErrorResponse('Drug not found', 404);
//     }

//     await prisma.arranged.update({
//       where: { id: params.id },
//       data: {
//         medicineId,
//         medicine_amount: medicineAmount,
//         medicine_method: medicineMethod,
//         medicine_condition: medicineCondition,
//         medicine_unit_eating: medicineUnitEating,
//         medicine_frequency: medicineFrequency,
//         medicine_advice: medicineAdvice,
//         arrang_status,
//         print_status,
//         error00,
//         error01,
//         error02,
//         error03,
//         error04,
//         error05,
//         error06,
//         error07,
//         error08,
//         error09,
//         error10,
//         checkComment,
//         user_arrang,
//         user_arrang_time,
//         user_check_time,
//         barcode,
//       },
//     });

//     return NextResponse.json({
//       ...ArrangedObj,
//       message: 'Arranged has been updated successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// }

// export async function DELETE(_req: Request, { params }: Params) {
//   try {
//     const ArrangedObj = await prisma.arranged.delete({
//       where: { id: params.id },
//     });
//     if (!ArrangedObj) {
//       return getErrorResponse('Drug not found', 404);
//     }

//     return NextResponse.json({
//       ...ArrangedObj,
//       message: 'Arranged has been removed successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// }
