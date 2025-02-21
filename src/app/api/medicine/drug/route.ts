import { type NextRequest, NextResponse } from 'next/server';

// import { auth } from '@/auth';
import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req:NextRequest) => {
  try {
    // if (req.auth) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    const query = q ? { id: { contains: q, mode: QueryMode.insensitive } } : {};

    // const page = Number.parseInt(searchParams.get('page') as string, 10) || 1;
    // const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 10000;
    // const skip = (page - 1) * pageSize;

    // const [result, total] = await Promise.all([
    //   prisma.medicine.findMany({
    //     where: query,
    //     include: {
    //       cabinet: true,
    //     },
    //     skip,
    //     take: pageSize,
    //     orderBy: { createdAt: 'desc' },
    //   }),
    //   prisma.medicine.count({ where: query }),
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
      prisma.medicine.findMany({
        where: query,
        include: {
          cabinet: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.medicine.count({ where: query }),
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
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};

// export const POST = async (req: NextRequest) => {
//   try {
//     // if (req.auth) {
//     const {
//       medicineCode,
//       medicineImage1,
//       medicineImage2,
//       medicineImage3,
//       name,
//       medicineName_en,
//       medicinePackageSize,
//     } = await req.json();

//     // console.log(medicineImage1);
//     const MedicineObj = await prisma.medicine.create({
//       data: {
//         medicineCode,
//         medicineImage1,
//         medicineImage2,
//         medicineImage3,
//         name,
//         medicineName_en,
//         medicinePackageSize,
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
