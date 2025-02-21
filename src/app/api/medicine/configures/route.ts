import { type NextRequest, NextResponse } from 'next/server';

// import { auth } from '@/auth';
import { getErrorResponse } from '@/libs/helpers';
import { prisma, QueryMode } from '@/libs/prisma.db';

export const GET = async (req: NextRequest) => {
  try {
    // if (req.auth) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    const query = q ? { id: { contains: q, mode: QueryMode.insensitive } } : {};

    const page = Number.parseInt(searchParams.get('page') as string, 10) || 1;
    const pageSize = Number.parseInt(searchParams.get('limit') as string, 10) || 25;
    const skip = (page - 1) * pageSize;

    const [result, total] = await Promise.all([
      prisma.configure.findMany({
        where: query,
        skip,
        take: pageSize,
        // orderBy: { createdAt: 'desc' },
      }),
      prisma.configure.count({ where: query }),
    ]);

    const pages = Math.ceil(total / pageSize);

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

// export const POST = async (req: NextRequest) => {
//   try {
//     const {
//       hospitalCode,
//       hospitalLogo,
//       hospitalInitial,
//       hospitalNameTh,
//       hospitalNameEn,
//       hospitalDate,
//       hospitalTime,
//       hospitalQueueDay,
//       hospitalStatus,
//       hospitalStation,
//       hospitalCallMessage,
//       hospitalMessage,
//     } = await req.json();

//     const ConfigObj = await prisma.configure.create({
//       data: {
//         hospital_code: hospitalCode,
//         hospital_logo: hospitalLogo,
//         hospital_initial: hospitalInitial,
//         hospital_nameTH: hospitalNameTh,
//         hospital_nameEN: hospitalNameEn,
//         hospital_date: hospitalDate,
//         hospital_time: hospitalTime,
//         hospital_queue_day: Number(hospitalQueueDay),
//         hospital_status: hospitalStatus,
//         hospital_station: hospitalStation as string,
//         hospital_call_message: hospitalCallMessage as string,
//         hospital_message: hospitalMessage as string,
//       },
//     });

//     return NextResponse.json({
//       ConfigObj,
//       message: 'Configured has been created successfully',
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };
