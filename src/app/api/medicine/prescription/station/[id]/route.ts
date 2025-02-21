// import { endOfDay, startOfDay } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';

// import { utcDate } from '@/libs/dateTime';
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
  // const todayStart = startOfDay(new Date());
  // const todayEnd = endOfDay(new Date());
  try {
    // if (req.auth) {
    const myArray: any = [];
    const myDetail: any = [];

    if (!id) {
      return getErrorResponse('Station not found', 404);
    }

    const arrangeds = await prisma.prescription.findMany({
      where: {
        prescrip_status: 'กำลังจัดยา',
        // createdAt: {
        //   gte: todayStart, // ตั้งแต่เวลาเริ่มต้นของวัน
        //   lte: todayEnd, // จนถึงเวลาสิ้นสุดของวัน
        // },

        // autoLoad: {
        //   not: null, // เช็คว่า autoLoad ไม่เป็น null หรือค่าว่าง
        // },
      },
      include: {
        arranged: {
          where: {
            user_arrang_time: null,
          },
          include: {
            medicine: {
              include: {
                cabinet:
                {
                  where: { storage_station: id },

                },
              },
            },
          },
        },
      },
    });
    if (arrangeds) {
      arrangeds.map(async (obj) => {
        // console.log(obj);
        obj.arranged.map(async (arrang) => {
          const num = arrang?.medicine?.cabinet?.length;

          // console.log(arrang);
          if (num) {
            myArray.push(arrang.prescripId);
            myDetail.push(arrang.medicineId);
          }
        });
      });
    }

    let master: any = [];
    let medicine: any = [];

    if (myArray && myDetail) {
      master = await prisma.prescription.findMany({
        where: { id: { in: myArray } },
        include: {
          arranged: {
            where: { user_arrang_time: null }, // เงื่อนไขเดิมที่ต้องการ
            include: {
              autoload: {
                select: {
                  load_number: true,
                },
              },
            },

          },

        },
        orderBy: { urgent: 'desc' },
      });

      medicine = await prisma.arranged.findMany({
        where: { prescripId: { in: myArray }, medicineId: { in: myDetail }, user_arrang_time: null },
        include: {
          autoload: {
            select: {
              load_number: true,
            },
          },
          medicine: {
            include: {
              cabinet: {
                where: { storage_station: id as string },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      data: master,
      detail: medicine,
    });
    // }
    // return Response.json({ message: 'Not authenticated' }, { status: 401 });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};
