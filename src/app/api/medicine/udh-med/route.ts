import dayjs from 'dayjs';
import { type NextRequest, NextResponse } from 'next/server';

// import { DateLongTH, utcDate } from '@/libs/dateTime';
import { DateLongTH } from '@/libs/dateTime';
// import { DateLongTH } from '@/libs/dateTime';
import { getErrorResponse } from '@/libs/helpers';
import { prisma } from '@/libs/prisma.db';

export const GET = async (_req: NextRequest) => {
  try {
    // const url = 'http://172.16.2.254:3000/udh/med-hn';
    // const details = 'http://172.16.2.254:3000/udh/med-pay';
    const url = 'http://localhost:8000/med-hn';
    const details = 'http://localhost:8001/med-pay';
    // const lastDays = new Date(lastDay).toISOString();
    const [response, res] = await Promise.all([
      fetch(url, { cache: 'no-cache' }),
      fetch(details, { cache: 'no-cache' }),
    ]);

    if (!response.ok || !res.ok) {
      throw new Error(`Fetch error: ${response.status}, ${res.status}`);
    }
    const data = (await response.json())?.data || [];
    const detail1 = (await res.json())?.data || [];
    // const data = data1?.data?.map((item: any) => item.hn);
    // console.log(data);
    // console.log(detail1);

    // สร้าง array สำหรับเก็บข้อมูลที่ตรงกัน
    // const matchedData = await Promise.all(data.map(async (item: any) => {
    const matchedData = await Promise.all(
      data
        .filter((item: any, index: number, self: any[]) => {
          // สร้าง Set เพื่อเก็บข้อมูลที่ไม่ซ้ำ
          const uniqueKey = `${item.hn[0]}-${item.regNo}-${item.qMedNo}`;
          return self.findIndex((i: any) => `${i.hn[0]}-${i.regNo}-${i.qMedNo}` === uniqueKey) === index;
        })
        .map(async (item: any) => {
          const matchingDetails = detail1.filter((d: any) =>
            d.hn.includes(item.hn[0]) && d.deptCode[0].includes(item.deptCode),
          );

          const matchingCount = matchingDetails.length;
          const dayjsNow = dayjs();
          const dayjsStartDate = dayjsNow.startOf('day');
          const dayjsEndDate = dayjsNow.endOf('day');

          if (matchingCount > 0) {
            // ตรวจสอบข้อมูลในฐานข้อมูล
            const checkData = await prisma.prescription.findFirst({
              where: {
                AND: [
                  { createdAt: { gte: new Date(dayjsStartDate.format('YYYY-MM-DDTHH:mm:ss')) } },
                  { createdAt: { lte: new Date(dayjsEndDate.format('YYYY-MM-DDTHH:mm:ss')) } },
                ],
                hnCode: item.hn[0]?.trim(),
                queue_code: item.qMedNo?.trim(),
                prescripCode: item.regNo?.trim(),

                // createdAt: { gte: new Date(utcDate), lte: new Date(new Date(utcDate).setDate(new Date(utcDate).getDate() + 1)) },
              },
            });

            if (!checkData) {
              const queue: any = await prisma.configure.findFirst();

              if (DateLongTH(queue?.hospital_date) !== DateLongTH(new Date())) {
                await prisma.configure.update({
                  data: {
                    hospital_date: new Date(),
                    hospital_queue_day: 1,
                  },
                  where: { id: queue?.id },
                });
              } else {
                await prisma.configure.update({
                  where: { id: queue?.id },
                  data: {
                    hospital_date: new Date(),
                    hospital_queue_day: Number(queue?.hospital_queue_day) + 1,
                  },
                });
              }

              const QueueNum = await prisma.configure.findFirst();
              const allergy = await prisma.medicine.findFirst({
                where: {
                  medicineCode: item.medCode || '',
                },
              });
              const queueT = item.qMedNo?.slice(0, 1) || '';
              // if (queueT === 'F') {
              //   return null; // ถ้า queueT เป็น 'F' ข้ามข้อมูลนี้ไป
              // }
              let Qtype: string;
              if (queueT === 'F') {
                Qtype = 'B';
              } else {
                Qtype = 'A';
              }

              // const queuetypesC = ['000', '0101', '019', '031', '032', '040', '0411', '042', '043', '045', '046', '049', '050', '0501', '0503', '0504', '0506', '0508', '052', '053', '054', '055', '056', '057', '058', '059', '0591', '060', '061', '070', '071', '110', '124', '135'].includes(item.deptCode?.trim()) ? 'C' : Qtype;
              // // const prescripStatus = ['A', 'B', 'C', 'D'].includes(Qtype) ? process.env.NEXT_STATUS1 : process.env.NEXT_STATUS0;
              // const queuetypesD = ['090', '091'].includes(item.deptCode?.trim()) ? 'D' : Qtype;
              const finalQueueType = ['090', '091'].includes(item.deptCode?.trim())
                ? 'D'
                : (['000', '0101', '019', '031', '032', '040', '0411', '042', '043', '045', '046', '049', '050', '0501', '0503', '0504', '0506', '0508', '052', '053', '054', '055', '056', '057', '058', '059', '0591', '060', '061', '070', '071', '110', '124', '135'].includes(item.deptCode?.trim()) ? 'C' : Qtype);
              const prescripStatus = ['A', 'C', 'D'].includes(Qtype) ? 'รอจับคู่ตะกร้า' : 'จ่ายยาสำเร็จ';
              let firstIssTime7 = matchingDetails[0]?.firstIssTime || null;

              if (firstIssTime7) {
                const date7 = new Date(firstIssTime7); // แปลงเป็น Date object
                date7.setHours(date7.getHours() - 7); // ลด 7 ชั่วโมง
                firstIssTime7 = date7.toISOString(); // แปลงกลับเป็น string ในรูปแบบ ISO
              }
              // สร้างข้อมูลใหม่
              await prisma.prescription.create({
                data: {
                  hnCode: item.hn[0]?.trim() || '',
                  full_name: item.fullname?.trim() || '',
                  // queue_type: Qtype,
                  queue_type: finalQueueType,
                  queue_num: String(QueueNum?.hospital_queue_day),
                  queue_code: item.qMedNo?.trim() || '',
                  prescripCode: item.regNo?.trim() || '',
                  // prescrip_status: 'รอคัดกรอง',
                  prescrip_status: prescripStatus,
                  delivery: 'โรงพยาบาล',
                  medicine_total: matchingCount || '',
                  doctor_names: item.doctor_name?.trim() || '',
                  pay_type: item.pay_typedes?.trim() || '',
                  dept_name: item.deptDesc?.trim() || '',
                  age: item.age || '',
                  dept_code: item.deptCode?.trim() || '',
                  drug_allergy: `${item.medCode?.trim() || ''}${','}${allergy?.name || ''}${' '} ${item.alergyNote?.trim() || ''}`,
                  //  ${item.alergyNote?.trim() || ''}
                  // firstIssTime: matchingDetails[0]?.firstIssTime || null,
                  firstIssTime: firstIssTime7 || null,
                  arranged: {
                    create: await Promise.all(matchingDetails.map(async (detail: any, index: number) => {
                      const medicine = await prisma.medicine.findUnique({
                        where: {
                          medicineCode: detail?.invCode.trim() || '',
                        },
                      });
                      let cabinet = null;
                      if (medicine) {
                        cabinet = await prisma.cabinet.findFirst({
                          where: {
                            medicineId: medicine.id,
                          },
                        });
                      }

                      let medicineName = detail?.gen_name?.trim() || '';
                      if (!medicine) {
                        medicineName += ' (ยาไม่มีในระบบ)';
                      } else if (medicine?.medicinetype === 'E' && !cabinet) {
                        medicineName += ' (เวชภัณฑ์ ไม่มียาในตู้)';
                      } else if (!cabinet) {
                        medicineName += ' (ไม่มียาในตู้)';
                      }
                      return {
                        labelNo: `${String(index + 1)}/${String(matchingDetails.length)}`,
                        ...(medicine && {
                          medicine: {
                            connect: { id: medicine.id },
                          },
                        }),
                        medicineCode: detail?.invCode.trim() || '',
                        medicine_name: medicineName,
                        medicineFrequencyEn: detail?.AUXDES?.trim() || '',
                        medicinePackageSize: detail?.unit || '',
                        medicine_amount: detail?.accQty || 0,
                        med_detail1: detail?.med_detail?.trim() || '',
                        med_detail: `${detail?.lamed_name?.trim() || ''} ${detail?.lamedQty?.trim() || ''} ${detail?.lamed_name_unit?.trim() || ''} ${detail?.lamedTimeText?.trim() || ''}`,
                        medicine_advice: detail?.lamedText?.trim() || '',
                        prod_type: detail?.prod_type?.trim() || '',
                        medicineUnitEatingEn: detail?.addr?.trim() || '',
                        dispcause: detail?.dispCause || '',
                        medsts: detail?.medSts || '',
                        lastDisp: detail?.lastDispense || '',
                      };
                    })),
                  },
                },
                include: {
                  arranged: true,
                },
              });
            }
            return item;
          }
          return null;
        }),
    );

    // กรองข้อมูล null ออก
    const filteredMatchedData = matchedData.filter(Boolean);

    return NextResponse.json({
      // data,
      // detail1,
      // matchedData,
      filteredMatchedData,
    });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};
