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
    const drugObj = await prisma.medicine.findMany({
      where: { id: id as string },
    });

    return NextResponse.json({
      drugObj,
      message: 'Drug has been get successfully',
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
//       name,
//       medicineName_th,
//       medicineName_en,
//       medicinePackageSize,
//       medicineCode,
//       medicineImage1,
//       medicineImage2,
//       medicineImage3,
//       medicineNote,
//     } = await req.json();

//     await prisma.medicine.upsert({
//       // where: { medicineCode: params.id },
//       where: { medicineCode: params.id },
//       create: {
//         medicineCode: (params.id),
//         name,
//         medicineName_th,
//         medicineName_en,
//         medicinePackageSize,

//       },
//       update: {
//         name,
//         medicineName_th,
//         medicineName_en,
//         medicinePackageSize,
//         medicineCode,
//         medicineImage1,
//         medicineImage2,
//         medicineImage3,
//         medicineNote,
//       },
//     });
//     return NextResponse.json({
//       message: 'Drug has been updated successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// }

// export async function DELETE(_req: Request, { params }: Params) {
//   try {
//     const DurgObj = await prisma.medicine.delete({
//       where: { id: params.id },
//     });
//     if (!DurgObj) {
//       return getErrorResponse('Drug not found', 404);
//     }

//     return NextResponse.json({
//       ...DurgObj,
//       message: 'Drug has been removed successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// }
