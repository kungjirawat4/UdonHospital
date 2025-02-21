import { NextRequest, NextResponse } from 'next/server';


import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req:NextRequest) => {
  try {
    // if (req.auth) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    const query = q
      ? {
          OR: [
            { id: { contains: q, mode: QueryMode.insensitive } },
            { name: { contains: q, mode: QueryMode.insensitive } },
          ],
        }
      : {};

    const page = Number.parseInt(searchParams.get('page') as string, 10) || 1;
    const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 25;
    const skip = (page - 1) * pageSize;

    const [result, total] = await Promise.all([
      prisma.medicine.findMany({
        where: query,
        select: {
          id: true,
          name: true,
        },

        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.medicine.count({ where: query }),
    ]);

    const pages = Math.ceil(total / pageSize);

    // console.log(result);

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    });
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

// export const POST = async (req:NextRequest) => {
//   try {
//     // if (req.auth) {
//     const {
//       medicineCode,
//       medicineImage1,
//       medicineImage2,
//       medicineImage3,
//       name,
//       medicineName_th,
//       medicineName_en,
//       medicinePackageSize,
//       medicine_method,
//       medicineMethodEn,
//       medicine_condition,
//       medicine_unit_eating,
//       medicineUnitEatingEn,
//       medicine_frequency,
//       medicineFrequencyEn,
//       medicine_advice,
//       medicineAdviceEn,
//       medicineNote,
//     } = await req.json();

//     // console.log(medicineImage1);
//     const MedicineObj = await prisma.medicine.create({
//       data: {
//         medicineCode,
//         medicineImage1,
//         medicineImage2,
//         medicineImage3,
//         name,
//         medicineName_th,
//         medicineName_en,
//         medicinePackageSize,
//         medicine_method,
//         medicineMethodEn,
//         medicine_condition,
//         medicine_unit_eating,
//         medicineUnitEatingEn,
//         medicine_frequency,
//         medicineFrequencyEn,
//         medicine_advice,
//         medicineAdviceEn,
//         medicineNote,
//       },
//     });

//     return NextResponse.json({
//       MedicineObj,
//       message: 'Drug has been created successfully',
//     });
//     // }
//     // return Response.json({ message: 'Not authenticated' }, { status: 401 });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };
