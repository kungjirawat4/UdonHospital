// import { NextResponse } from 'next/server';

// import { getErrorResponse } from '@/libs/helpers';
// import { db } from '@/libs/prisma.db';

// type Params = {
//   params: {
//     id: string;
//   };
// };

// export const GET = async (_req: Request, { params }: Params) => {
//   try {
//     const data: any = [];
//     const cabinet = await db.prescription.findFirst({
//       where: {
//         id: params.id,
//       },
//       select: {
//         arranged: {
//           select: {
//             medicineCode: true,
//             medicine_amount: true,
//             medicine: {
//               select: {
//                 medicineCode: true,
//                 cabinet: {
//                   select: {
//                     cabinet: true,
//                     plcId: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },

//     });
//     if (!cabinet) {
//       return getErrorResponse('No prescription found in the system', 500);
//     }

//     cabinet?.arranged.map(async (obj) => {
//       // // eslint-disable-next-line no-console
//       // console.log(obj);

//       obj.medicine?.cabinet.map(async (cabinets) => {
//         if (cabinets.cabinet === 'HYB') {
//           data.push({ type: 'hyb', medicineCode: obj.medicine?.medicineCode, ip: cabinets.plcId, count: obj.medicine_amount, Number1: 1, Number2: 1, Number3: 1, Number4: 1, timeout: 5000 });
//         } else {
//           data.push({ type: 'mn', medicineCode: obj.medicine?.medicineCode, ip: cabinets.plcId, count: obj.medicine_amount, Number1: 1, Number2: 1, Number3: 1, Number4: 1, timeout: 5000 });
//         }
//       });
//     });

//     if (data) {
//       await fetch('http://192.168.3.20:1234/sendCommand/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       // axios.post('http://192.168.3.20:1234/sendCommand', { data });

//       // console.log(data);
//     }

//     return NextResponse.json({
//       data,
//       // status: 200,
//       // message: `This channel is match successfully`,
//     });
//   } catch ({ status = 500, message }: any) {
//     return getErrorResponse(message, status);
//   }
// };

import { NextRequest, NextResponse } from 'next/server';

import { getErrorResponse } from '@/libs/helpers';
// import { publishMessage } from '@/libs/mqttservice';
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
    const data: any = [];
    const cabinet = await prisma.prescription.findFirst({
      where: {
        id: id,
      },
      select: {
        arranged: {
          select: {
            id: true,
            medicine_name: true,
            medicineCode: true,
            medicine_amount: true,
            medicine: {
              select: {
                medicineCode: true,
                name: true,
                medicineName_en: true,
                cabinet: {
                  select: {
                    mqtt_topic: true,
                    storage_position: true,
                    cabinet: true,
                    plcId: true,
                  },
                },
              },
            },
          },
        },
      },

    });
    if (!cabinet) {
      return getErrorResponse('No prescription found in the system', 500);
    }

    cabinet?.arranged.map(async (obj) => {
      // // eslint-disable-next-line no-console
      // console.log(obj);

      obj.medicine?.cabinet.map(async (cabinets) => {
        if (cabinets.cabinet === 'HYB') {
          if (cabinets.plcId) {
            data.push({ type: 'HYB', ip: cabinets.plcId,id: obj.id, status:1,  count: obj.medicine_amount});
          }
        } else if (cabinets.cabinet === 'COOL') {
          const topicRegex = /^UDH\/E\/E(\d)\/(\d)\.(\d)$/;
          const match = cabinets.mqtt_topic?.match(topicRegex);

          if (match) {
            const x = Number.parseInt(match[1] || '', 10);
            const y = Number.parseInt(match[2] || '', 10);
            const z = Number.parseInt(match[3] || '', 10);

            let slave;
            if (x === 3) {
              if (z >= 1 && z <= 4) {
                slave = (y - 1) * 4 + z;
              } else if (z >= 5 && z <= 8) {
                slave = 16 + (y - 1) * 4 + z;
              } else if (z >= 9 && z <= 12) {
                slave = 32 + (y - 1) * 4 + z;
              }
            } else if (x === 4) {
              if (z >= 1 && z <= 4) {
                slave = 60 + (y - 1) * 4 + z;
              } else if (z >= 5 && z <= 8) {
                slave = 76 + (y - 1) * 4 + z;
              } else if (z >= 9 && z <= 12) {
                slave = 92 + (y - 1) * 4 + z;
              }
            }

            if (slave !== undefined) {
              const medicineName = obj.medicine_name
                ? obj.medicine_name.length > 20
                  ? `${obj.medicine_name.slice(0, 20)}...`
                  : obj.medicine_name
                : '';
              // publishMessage(`${cabinets.mqtt_topic}`, JSON.stringify({
              //   mac: cabinets.plcId,
              //   slave: slave.toString(),
              //   data: `${obj.medicine_amount}${','}${medicineName}`,
              // }));
            } else {
              console.error('Invalid value of x in topic:', cabinets.mqtt_topic);
            }
          }
        } else if (cabinets.cabinet === 'HAD') {
          const topicRegex = /^UDH\/E\/E(\d)\/(\d)\.(\d)$/;
          const match = cabinets.mqtt_topic?.match(topicRegex);
          if (match) {
            const x = Number.parseInt(match[1] || '', 10);
            const y = Number.parseInt(match[2] || '', 10);
            const z = Number.parseInt(match[3] || '', 10);

            let slave;
            if (x === 5) {
              slave = (y - 1) * 3 + z;
            } else if (x === 6) {
              slave = 27 + (y - 1) * 3 + z;
            } else if (x === 7) {
              slave = 54 + (y - 1) * 3 + z;
            } else if (x === 8) {
              slave = 81 + (y - 1) * 3 + z;
            }

            if (slave !== undefined) {
              const medicineName = obj.medicine_name
                ? obj.medicine_name.length > 20
                  ? `${obj.medicine_name.slice(0, 20)}...`
                  : obj.medicine_name
                : '';
              // publishMessage(`${cabinets.mqtt_topic}`, JSON.stringify({
              //   mac: cabinets.plcId,
              //   slave: slave.toString(),
              //   data: `${obj.medicine_amount}${','}${medicineName}`,
              // }));
            } else {
              console.error('Invalid value of x in topic:', cabinets.mqtt_topic);
            }
          }
        } else if(cabinets.cabinet === 'SMD') {
          if (cabinets.plcId) {
            data.push({ type: 'SMD',ip: cabinets.plcId,id: obj.id, status:1,  count: obj.medicine_amount });
          }
        }
      });
    });
    // else if (cabinets.cabinet === 'COOL') {
    //   const medicineName = obj.medicine_name
    //     ? obj.medicine_name.length > 20
    //       ? `${obj.medicine_name.slice(0, 20)}...`
    //       : obj.medicine_name
    //     : '';
    //   publishMessage(`${cabinets.mqtt_topic}`, JSON.stringify({ mac: cabinets.plcId, slave: cabinets.storage_position?.slice(2), data: `${obj.medicine_amount}${','}${medicineName}` }));
    //   // data.push({ type: 'cool', medicineCode: obj.medicine?.medicineCode, medicine_name: obj.medicine_name, ip: cabinets.plcId, count: obj.medicine_amount });
    // }
    // else if (cabinets.cabinet === 'HAD') {
    //   const medicineName = obj.medicine_name
    //     ? obj.medicine_name.length > 20
    //       ? `${obj.medicine_name.slice(0, 20)}...`
    //       : obj.medicine_name
    //     : '';

    //   publishMessage(`${cabinets.mqtt_topic}`, JSON.stringify({ mac: cabinets.plcId, slave: cabinets.storage_position?.slice(2), data: `${obj.medicine_amount}${','}${medicineName}` }));
    //   // data.push({ type: 'had', medicineCode: obj.medicine?.medicineCode, medicine_name: obj.medicine_name, ip: cabinets.plcId, count: obj.medicine_amount });
    // }
    // if (data) {
    //   await fetch('http://192.168.3.20:1234/sendCommand/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });

      // axios.post('http://192.168.3.20:1234/sendCommand', { data });

      // console.log(data);
    // }

    return NextResponse.json({
      data,
      // status: 200,
      // message: `This channel is match successfully`,
    });
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status);
  }
};
