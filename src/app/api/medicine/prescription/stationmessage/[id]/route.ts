// import { endOfDay, startOfDay } from 'date-fns';
import { type NextRequest, NextResponse } from 'next/server';

// import { utcDate } from '@/libs/dateTime';
import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';
import dayjs from 'dayjs';
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
  const dayjsNow = dayjs();
  const dayjsStartDate = dayjsNow.startOf('day');
  const dayjsEndDate = dayjsNow.endOf('day');
  try {
    // if (req.auth) {
    const myArray: any = [];
    const myDetail: any = [];

    if (!id) {
      return getErrorResponse('Hospital not found', 404);
    }

    const arrangeds = await prisma.prescription.findMany({
      include: {
        arranged: {
          where: {

            // user_arrang_time: null,
            AND: [
              { createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
              { createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
              { user_arrang_time: { not: null } },
              { medicineAdviceEn: null } // ยังไม่มีคนจัดยา
            ],
            OR: [

              { error00: { not: null } },
              { error01: { not: null } },
              { error02: { not: null } },
              { error03: { not: null } },
              { error04: { not: null } },
              { error05: { not: null } },
              { error06: { not: null } },
              { error07: { not: null } },
              { error08: { not: null } },
              { error09: { not: null } },
              { error10: { not: null } },
            ]
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
            where: {
              // user_arrang_time: null 
              AND: [
                { user_arrang_time: { not: null } },
                { medicineAdviceEn: null } // ยังไม่มีคนจัดยา
              ],
              OR: [

                { error00: { not: null } },
                { error01: { not: null } },
                { error02: { not: null } },
                { error03: { not: null } },
                { error04: { not: null } },
                { error05: { not: null } },
                { error06: { not: null } },
                { error07: { not: null } },
                { error08: { not: null } },
                { error09: { not: null } },
                { error10: { not: null } },

              ]
            }, // เงื่อนไขเดิมที่ต้องการ
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
        where: {
          prescripId: { in: myArray }, medicineId: { in: myDetail },
          AND: [
            { user_arrang_time: { not: null } },
            { medicineAdviceEn: null } // ยังไม่มีคนจัดยา
          ],
          OR: [

            { error00: { not: null } },
            { error01: { not: null } },
            { error02: { not: null } },
            { error03: { not: null } },
            { error04: { not: null } },
            { error05: { not: null } },
            { error06: { not: null } },
            { error07: { not: null } },
            { error08: { not: null } },
            { error09: { not: null } },
            { error10: { not: null } },

          ]

        },
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
