// // if (process.env.NODE_ENV !== 'production') globalThis.ioGlobal = io
// import { Socket, Server as SocketIOServer } from 'socket.io';

// import cron from "node-cron";
// import axios from 'axios';
// import { db } from './lib/prisma.db';
// import { dayjsEndDate, dayjsNow, dayjsStartDate } from './lib/date';

// import 'dotenv/config';

// export let io: SocketIOServer | undefined;

// const { NEXT_PUBLIC_API_URL } = process.env;

// const initSocketSingleton = () => {
//   if (!io) {
//     io = new SocketIOServer({
//       cors: {
//         origin: '*',
//         methods: 'GET,POST',
//       },
//     });


//     io.on('connection', async (socket: Socket) => {
//       // axios
//       try {
//         // const callAutoload = async () => {
//         //   await axios
//         //     .get(`${NEXT_PUBLIC_API_URL}/autoload/prescription`)
//         //     .then(res => {
//         //       // db.$disconnect();
//         //     })
//         //     .catch(error => {
//         //       db.$disconnect();
//         //       console.error(error)
//         //     })
//         // }

//         // const callConfig = async () => {
//         //   await axios
//         //     .get(`${NEXT_PUBLIC_API_URL}/dashboard/hospital`)
//         //     .then(res => {
//         //       socket.emit('config', res?.data?.data); // ส่งไปยัง client
//         //       //console.log(res?.data?.data)
//         //       // db.$disconnect();
//         //     })
//         //     .catch(error => {
//         //       db.$disconnect();
//         //       console.error(error)
//         //     })
//         // }

//         // const callQueue = async () => {
//         //   await axios
//         //     .get(`${NEXT_PUBLIC_API_URL}/udh/med-queue`)
//         //     .then(res => {
//         //       socket.emit('queue', res?.data); // ส่งไปยัง client
//         //       // console.log(res?.data)
//         //       // db.$disconnect();
//         //     })
//         //     .catch(error => {
//         //       db.$disconnect();
//         //       console.error(error)
//         //     })
//         // }
//         const callQueue = async () => {
//           await axios
//             .get(`${NEXT_PUBLIC_API_URL}/udh/med-queue`)
//             .then(res => {
//               if(res?.status === 200) {
//                 socket.emit('queue', res?.data); // ส่งไปยัง client
//               }

//               db.$disconnect();
//             })
//             .catch(error => {
//               db.$disconnect();
//               // console.error(error)
//             })
//         }

//         const callDashboard = async () => {
//           await axios
//             .get(`${NEXT_PUBLIC_API_URL}/dashboard`)
//             .then(res => {
//               socket.emit('dashboard', res?.data); // ส่งไปยัง client
//               // console.log(res?.data)
//               // db.$disconnect();
//             })
//             .catch(error => {
//               db.$disconnect();
//               console.error(error)
//             })
//         }

//         // const callUser = async () => {
//         //   await axios
//         //     .get(`${NEXT_PUBLIC_API_URL}/users`)
//         //     .then(res => {

//         //     })
//         //     .catch(error => {
//         //       console.error(error)
//         //     })
//         // }

//         // const callUdhQueue = async () => {
//         //   await axios
//         //      .get(`${NEXT_SERVER_API_URL}/udh/quemed-info`)
//         //      .then(async res => {
//         //        const data = res?.data?.data
//         //      if (data?.length > 0) {
//         //        await axios
//         //        .post(`${NEXT_SERVER_API_URL}/udh/med-queue`)
//         //        .then(res => {
//         //         //  db.$disconnect();
//         //        })
//         //        .catch(error => {
//         //          console.error(error)
//         //        })
//         //      }
//         //      })
//         //      .catch(error => {
//         //        console.error(error)
//         //      })
//         //  }

//         //  const payUdhQueue = async () => {
//         //   await axios
//         //   .get(`${NEXT_SERVER_API_URL}/udh/quemed-pay`)
//         //   .then(async res => {
//         //     const data = res?.data?.data
//         //     if (data?.length > 0) {
//         //       await axios
//         //       .post(`${NEXT_SERVER_API_URL}/udh/med-qpay`)
//         //       .then(res => {
//         //         // db.$disconnect();
//         //       })
//         //       .catch(error => {
//         //         console.error(error)
//         //       })
//         //     }
//         //   })
//         //   .catch(error => {
//         //     console.error(error)
//         //   })
//         //  }

//         cron.schedule("* * * * * *", function () {
//           const toDay = new Date().toLocaleDateString('th-TH', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             weekday: 'long',
//             hour: 'numeric',
//             minute: 'numeric',
//             second: '2-digit'
//           })
//           socket.emit('todate', toDay); // ส่งไปยัง client
//           socket.emit('welcome', 'ยินดีต้อนรับสู่ ระบบบริหารจัดการห้องยา'); // ส่งไปยัง client
//           callDashboard()
//           callQueue();

//           // console.log("running a task every 2 second");
//         });

//         // cron.schedule("*/3 * * * * *", function () {
//         //   // callUdhQueue()
//         //   // payUdhQueue()
//         // })

//         // cron.schedule("*/30 * * * * *", function () {
//         //   console.log('30 วินาที')
//         //   callAutoload()
//         //   callConfig()
//         //   // callUser()
//         //   payUdhQueue()
//         // })
//       } catch (err) {
//         db.$disconnect();
//         throw err
//       }

//       // socket.on('disconnect', () => {
//       //   console.log(`Client disconnected: ${socket.id}`);
//       // });
//     });
// ///อันนี้อันเก่า
//     io.on('connection', async (socket: Socket) => {
//       try {
//         const callUdhQueue = async () => {
//           await axios
//             .get(`${NEXT_PUBLIC_API_URL}/udh/quemed-info`)
//             .then(async res => {
//               const data = res?.data?.data
//               if (data?.length > 0) {
//                 await axios
//                   .post(`${NEXT_PUBLIC_API_URL}/udh/med-queue`)
//                   .then(res => {
//                     //  db.$disconnect();
//                   })
//                   .catch(error => {
//                     console.error(error)
//                   })
//               }
//             })
//             .catch(error => {
//               console.error(error)
//             })
//         }

//         const payUdhQueue = async () => {
//           await axios
//             .get(`${NEXT_PUBLIC_API_URL}/udh/quemed-pay`)
//             .then(async res => {
//               const data = res?.data?.data
//               if (data?.length > 0) {
//                 await axios
//                   .post(`${NEXT_PUBLIC_API_URL}/udh/med-qpay`)
//                   .then(res => {
//                     // db.$disconnect();
//                   })
//                   .catch(error => {
//                     console.error(error)
//                   })
//               }
//             })
//             .catch(error => {
//               console.error(error)
//             })
//         }

//         const callUser = async () => {
//           await axios
//             .get(`${NEXT_PUBLIC_API_URL}/users`)
//             .then(res => {
//               // console.log(res?.data)
//               socket.emit('users', res?.data); // ส่งไปยัง client
//               db.$disconnect();
//             })
//             .catch(error => {
//               console.error(error)
//             })
//         }
//         // const callstation = async () => {
//         //   await axios
//         //     .get(`${NEXT_PUBLIC_API_URL}/prescription/station`)
//         //     .then(res => {
//         //       // console.log(res?.data)
//         //       socket.emit('station', res?.data); // ส่งไปยัง client
//         //       db.$disconnect();
//         //     })
//         //     .catch(error => {
//         //       console.error(error)
//         //     })
//         // }

//         cron.schedule("*/3 * * * * *", function () {
//           // callUdhQueue()
//           // payUdhQueue()
//           callUser()
//           // callstation()
//         })
//       } catch (err) {
//         db.$disconnect();
//         throw err
//       }
//     })

//     io.on('connection', async (socket: Socket) => {
//       try {
//         const callAutoload = async () => {
//           await axios
//             .get(`${NEXT_PUBLIC_API_URL}/autoload/prescription`)
//             .then(res => {
//               db.$disconnect();
//             })
//             .catch(error => {
//               db.$disconnect();
//               console.error(error)
//             })
//         }

//         const callConfig = async () => {
//           await axios
//             .get(`${NEXT_PUBLIC_API_URL}/dashboard/hospital`)
//             .then(res => {
//               socket.emit('config', res?.data?.data); // ส่งไปยัง client
//               db.$disconnect();
//             })
//             .catch(error => {
//               db.$disconnect();
//               console.error(error)
//             })
//         }

//         cron.schedule("*/30 * * * * *", function () {
//           // console.log('30 วินาที')
//           callAutoload()
//           callConfig()
//         })
//       } catch (err) {
//         db.$disconnect();
//         throw err
//       }
//     })




//     // /// ตัวนี้ที่อยู่ในเซิฟ
//     // io.on('connection', async (socket: Socket) => {
//     //   try {
//     //     const callUdhQueue = async () => {
//     //       const count = await axios
//     //          .get(`${NEXT_PUBLIC_API_URL}/udh/quemed-info`)
//     //          .then(async res => {
//     //           if (res.status === 200) {
//     //             const data = res?.data?.data
//     //             if(data.length > 0) {
//     //               await axios.post(`${NEXT_PUBLIC_API_URL}/udh/med-queue`, data)
//     //               .then(res => {
//     //                 // console.log(res.data)
//     //                 db.$disconnect();
//     //               })
//     //               .catch(error => {
//     //                 db.$disconnect();
//     //                 console.error(error)
//     //               })
//     //             }
//     //           }
//     //          })
//     //          .catch(error => {
//     //            console.error(error)
//     //          })
//     //      }

//     //     //  const callUser = async () => {
//     //     //   await axios
//     //     //     .get(`${NEXT_PUBLIC_APP_URL}/users`)
//     //     //     .then(res => {
//     //     //       // console.log(res?.data)
//     //     //       socket.emit('users', res?.data); // ส่งไปยัง client
//     //     //       db.$disconnect();
//     //     //     })
//     //     //     .catch(error => {
//     //     //       console.error(error)
//     //     //     })
//     //     // }

//     //     cron.schedule("*/3 * * * * *", function () {
//     //     callUdhQueue()

//     //       // callUser()
//     //       // socket.on('disconnect', () => {
//     //       //   console.log(`Client disconnected: ${socket.id}`);
//     //       // });
//     //     })
//     //   } catch (err) {
//     //     db.$disconnect();
//     //     throw err
//     //   }
//     // })

//     // io.on('connection', async (socket: Socket) => {
//     //   try {
//     //     const callAutoload = async () => {
//     //       await axios
//     //         .get(`${NEXT_PUBLIC_API_URL}/autoload/prescription`)
//     //         .then(res => {
//     //           db.$disconnect();
//     //         })
//     //         .catch(error => {
//     //           db.$disconnect();
//     //           console.error(error)
//     //         })
//     //     }

//     //     // const callConfig = async () => {
//     //     //   await axios
//     //     //     .get(`${NEXT_PUBLIC_APP_URL}/dashboard/hospital`)
//     //     //     .then(res => {
//     //     //       socket.emit('config', res?.data?.data); // ส่งไปยัง client
//     //     //        db.$disconnect();
//     //     //     })
//     //     //     .catch(error => {
//     //     //       db.$disconnect();
//     //     //       console.error(error)
//     //     //     })
//     //     // }

//     //     const payUdhQueue = async () => {
//     //       axios
//     //      .get(`${NEXT_PUBLIC_API_URL}/udh/quemed-pay`)
//     //      .then(async res => {
//     //          if (res.status === 200) {
//     //          const data = res?.data?.data
//     //          if (data?.length > 0) {
//     //             await axios
//     //            .post(`${NEXT_PUBLIC_API_URL}/udh/med-qpay`, data)
//     //            .then(res => {
//     //              // console.log('sdf',res.data)
//     //              db.$disconnect();
//     //            })
//     //            .catch(error => {
//     //              db.$disconnect();
//     //              console.error(error)
//     //            })
//     //          }
//     //        }
//     //      })
//     //      .catch(error => {
//     //        console.error(error)
//     //      })
//     //     }

//     //     cron.schedule("*/30 * * * * *", function () {
//     //       // console.log('30 วินาที')
//     //         callAutoload()
//     //         //  callConfig()
//     //         payUdhQueue()
//     //     })

//     //     // socket.on('disconnect', () => {
//     //     //   console.log(`Client disconnected: ${socket.id}`);
//     //     // });
//     //   } catch (err) {
//     //     db.$disconnect();
//     //     throw err
//     //   }
//     // })
//   }
//   return io!;
// }

// declare const globalThis: {
//   ioGlobal: ReturnType<typeof initSocketSingleton>;
// } & typeof global;

// io = globalThis.ioGlobal ?? initSocketSingleton()

// export default io;

// if (process.env.NODE_ENV !== 'production') globalThis.ioGlobal = io



import { Socket, Server as SocketIOServer } from 'socket.io';

import cron from "node-cron";
import axios from 'axios';
import { db } from './lib/prisma.db';

import 'dotenv/config';

export let io: SocketIOServer | undefined;

const { NEXT_PUBLIC_API_URL } = process.env;

const initSocketSingleton = () => {
  if (!io) {
    io = new SocketIOServer({
      cors: {
        origin: '*',
        methods: ['GET', 'PUT', 'POST'],
        credentials: true,

      },
      connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
      }
    });

    const toDay = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: '2-digit'
    })

    io.on('connection', async (socket: Socket) => {
      cron.schedule("* * * * * 1,2,3,4,5,6", async function () {
        await Promise.all([
          socket.emit('todate', toDay), // ส่งวันที่ไปยัง client
          await axios.get(`${NEXT_PUBLIC_API_URL}/udh/med-queue`)  // เรียกคิวแสดงแสดงทุกๆ 1 วินาที
            .then(res => {
              if (res.status === 200) {
                socket.emit('queue', res?.data); // ส่งไปยัง client
              }
              db.$disconnect();
            })
            .catch(error => {
              db.$disconnect();
              // console.error(error)
            }),

          await axios.get(`${NEXT_PUBLIC_API_URL}/dashboard`) // เรียก dashboard แสดงทุกๆ 1 วินาที
            .then(res => {
              if (res.status === 200) {
                socket.emit('dashboard', res?.data); // ส่งไปยัง client
              }
              db.$disconnect();
            })
            .catch(error => {
              db.$disconnect();
              // console.error(error)
            })
        ])
      })

      cron.schedule("*/3 * 1-21 * * 1,2,3,4,5,6", async function () { // ทุกๆ 3 วินาที ตั้งแต่ชั่วโมงที่ 1-21 ในวันจันทร์-วันศุกร์
        await Promise.all([
          await axios.get(`${NEXT_PUBLIC_API_URL}/udh/quemed-info`) // ดึงข้อมูลคิวโรงพยาบาล
            .then(async res => {
              if (res.status === 200) {
                const data = res?.data?.data
                if (data?.length > 0) {
                  await axios
                    .post(`${NEXT_PUBLIC_API_URL}/udh/med-queue`, data)  // ถ้ามีให้เพิ่มลงฐานข้อมูล
                    .then(res => {
                      db.$disconnect();
                    })
                    .catch(error => {
                      db.$disconnect();
                    })
                }
              }
            })
            .catch(error => {
              db.$disconnect();
            }),

          await axios.get(`${NEXT_PUBLIC_API_URL}/users`)  // ดึงข้อมูลผู้ใช้ส่งไปยัง client
            .then(res => {
              if (res.status === 200) {
                socket.emit('users', res?.data); // ส่งไปยัง client
              }
              db.$disconnect();
            })
            .catch(error => {
              db.$disconnect();
            })
        ])
      })

      cron.schedule("0 * 1-21 * * 1,2,3,4,5", async function () {   // ทุกๆ วินาที ที่ 0 ตั้งแต่ชั่วโมงที่ 1-21 ในวันจันทร์-วันศุกร์
        await Promise.all([
          await axios.get(`${NEXT_PUBLIC_API_URL}/autoload/randomprescription`)  // จัดคิวตามสัดส่วนชั้น2และ3 
            .then(res => {
              db.$disconnect();
            })
            .catch(error => {
              db.$disconnect();
              // console.error(error)
            }),

          await axios.get(`${NEXT_PUBLIC_API_URL}/udh/quemed-pay`) // ดึงข้อมูลเรียกคิวโรงพยาบาล
            .then(async res => {
              if (res.status === 200) {
                const data = res?.data?.data
                if (data?.length > 0) {
                  await axios
                    .post(`${NEXT_PUBLIC_API_URL}/udh/med-qpay`, data) // บันทึกลงฐานข้อมูล
                    .then(res => {
                      db.$disconnect();
                    })
                    .catch(error => {
                      db.$disconnect();
                    })
                }
              }
            })
            .catch(error => {
              db.$disconnect();
            }),

          await axios.get(`${NEXT_PUBLIC_API_URL}/dashboard/hospital`) // ดึงข้อมูลโรงพยาบาล
            .then(res => {
              if (res.status === 200) {
                socket.emit('config', res?.data?.data); // ส่งไปยัง client
              }
              db.$disconnect();
            })
            .catch(error => {
              db.$disconnect();
              console.error(error)
            })
        ])
      })

      // cron.schedule("0 0 */1 * * 1,2,3,4,5", function () {   // ทุกๆ 1 ชั่วโมง ตั้งแต่งชั่วโมงที่ 1-21 ในวันจันทร์-วันศุกร์
      //   console.log('1 ชั่วโมง', new Date() )
      // })

      // cron.schedule("0 0 22 * * 5", function () {    // ทุกๆ 22.00 โมงของวันศุกร์
      //   console.log('11', dayjs(new Date()).week())
      //   // dayjs(new Date()).week();

      // })

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
  return io!;
}

declare const globalThis: {
  ioGlobal: ReturnType<typeof initSocketSingleton>;
} & typeof global;

io = globalThis.ioGlobal ?? initSocketSingleton()

export default io;

if (process.env.NODE_ENV !== 'production') globalThis.ioGlobal = io