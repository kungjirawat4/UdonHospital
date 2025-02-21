// 'use client';

// import Image from 'next/image';
// import React, { use } from 'react';
// import Marquee from 'react-fast-marquee';

// import useApi from '@/hooks/useApi';
// import { socketClient } from '@/services/sockio';
// import moph from '#/public/assets/udh/logo_MOPH.png';
// import logo from '#/public/assets/udh/LOGO2.png';

// // const Queue = ({ params }: { params: { slug: string } }) => {
// const Queue = ({ params: paramsPromise }: { params: Promise<{ slug: string }> }) => {
//   const params = use(paramsPromise); // ใช้ React.use() เพื่อดึงค่า params
//   const chock = `/assets/udh/UDH${params.slug}.png`;
//   const [todate, setTodate] = React.useState('');
//   const [queue, setQueue] = React.useState([]);
//   const [marquee, setMarquee] = React.useState<string>();

//   React.useEffect(() => {
//     socketClient.on('queue', (arg: { data: React.SetStateAction<never[]> }) => {
//       setQueue(arg.data); // arg คือ data ที่มาจาก Server
//     });
//     socketClient.on('todate', (arg: React.SetStateAction<string>) => {
//       setTodate(arg); // arg คือ data ที่มาจาก Server
//     });
//     return () => {
//       socketClient.off('queue');
//       socketClient.off('todate');
//       // socketClient.disconnect();
//     };
//   }, []);

//   const qData: any = queue.filter((item: any) => item.channel2 === Number(`${params.slug}`));

//   const getMsgApi = useApi({
//     key: ['config'],
//     method: 'GET',
//     url: `medicine/configures`,
//   })?.get;

//   React.useEffect(() => {
//     getMsgApi?.refetch();
//   });

//   React.useEffect(() => {
//     setMarquee(getMsgApi?.data?.data[0]?.hospital_message);
//   }, [getMsgApi?.data]);

//   return (
//     <div className="flex h-screen flex-col">
//       <header className="h-1/5 bg-pink-500 text-center">
//         <br />
//         <div className="m-1 grid grow grid-cols-5 grid-rows-5 gap-2 text-white">
//           <div className="row-span-3 mt-[-26px] flex place-items-baseline justify-center">
//             <Image src={logo} alt="Logo" width={140} height={140} />
//           </div>
//           <div className="col-span-2 row-span-2 mr-[-80px] mt-[-20px] flex place-items-baseline justify-center md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
//             <big>
//               <b>ช่องบริการ</b>
//             </big>
//           </div>
//           <div className="z-20 col-start-4 row-span-3 -ml-0  mt-[-25px]">
//             <Image src={chock} alt="Logo" width={170} height={170} />
//           </div>
//           <div className="col-span-2 col-start-2 row-start-3 mr-[-75px]  mt-[-25px] flex justify-center text-amber-100 md:text-xl lg:text-2xl ">
//             <b>
//               <div suppressHydrationWarning>
//                 {todate}
//               </div>
//             </b>
//           </div>
//           <div className="col-start-5 row-span-3 row-start-1 mt-[-26px] flex place-items-baseline  justify-center">
//             <Image src={moph} alt="Logo" width={140} height={140} />
//           </div>
//         </div>
//       </header>
//       {(() => {
//         if (params.slug === '32') {
//           return (
//             <main className="m-1 flex h-3/4 justify-center bg-pink-100 text-center text-sky-700">
//               <div className="flex h-full items-center">

//                 <h1 className="sm:text-[8rem] md:text-[12] lg:text-[14rem] 2xl:text-[20rem]"><b>ยื่นใบสั่งยา</b></h1>

//               </div>
//             </main>
//           );
//         } else {
//           return (
//             <main className="m-1 flex h-3/4 bg-pink-100">
//               <div className="grid w-full grow grid-cols-4 grid-rows-12 gap-2 text-blue-800">
//                 <div className="row-span-2 flex h-[88px] items-center justify-center rounded-lg bg-green-800 text-white md:text-2xl lg:text-4xl xl:text-5xl">
//                   <b>
//                     <big>คิวที่</big>
//                   </b>
//                 </div>
//                 <div className="col-start-1 row-span-2 row-start-3 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

//                   <big>{qData[0] ? qData[0]?.queueCode : ''}</big>

//                 </div>
//                 <div className="col-start-1 row-span-2 row-start-5 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

//                   <big>{qData[1] ? qData[1].queueCode : ''}</big>

//                 </div>
//                 <div className="col-start-1 row-span-2 row-start-7 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

//                   <big>{qData[2] ? qData[2].queueCode : ''}</big>

//                 </div>
//                 <div className="col-start-1 row-span-2 row-start-9 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

//                   <big>{qData[3] ? qData[3].queueCode : ''}</big>

//                 </div>
//                 <div className="col-start-1 row-span-2 row-start-11 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

//                   <big>{qData[4] ? qData[4].queueCode : ''}</big>

//                 </div>
//                 <div className="col-span-3 col-start-2 row-span-2 row-start-1 flex h-[88px] items-center justify-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
//                   <b>
//                     <big>ชื่อ สกุล</big>
//                   </b>
//                 </div>
//                 <div className="col-span-3 col-start-2 row-span-2 row-start-3 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
//                   <big>
//                     <b>
//                       {qData[0] ? qData[0].fullName : ''}
//                     </b>
//                   </big>
//                 </div>
//                 <div className="col-span-3 col-start-2 row-span-2 row-start-5 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
//                   <big>
//                     <b>
//                       {qData[1] ? qData[1].fullName : ''}
//                     </b>
//                   </big>
//                 </div>
//                 <div className="col-span-3 col-start-2 row-span-2 row-start-7 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
//                   <big>
//                     <b>
//                       {qData[2] ? qData[2].fullName : ''}
//                     </b>
//                   </big>
//                 </div>
//                 <div className="col-span-3 col-start-2 row-span-2 row-start-9 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
//                   <big>
//                     <b>
//                       {qData[3] ? qData[3].fullName : ''}
//                     </b>
//                   </big>
//                 </div>
//                 <div className="col-span-3 col-start-2 row-span-2 row-start-11 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
//                   <big>
//                     <b>
//                       {qData[4] ? qData[4].fullName : ''}
//                     </b>
//                   </big>
//                 </div>
//                 {/* <div className="h-26 col-start-4 row-span-2 row-start-1 flex items-center justify-center rounded-lg bg-green-500 text-white md:text-2xl lg:text-4xl xl:text-6xl"> */}
//                 <div className="col-span-2 col-start-5 row-span-4 row-start-1 flex h-[88px] items-center justify-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
//                   <b>
//                     <big>คิวก่อน</big>
//                   </b>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-3 flex items-center justify-center  rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[5] ? qData[5].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-4 flex items-center justify-center  rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[6] ? qData[6].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-5 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[7] ? qData[7].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-6 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[8] ? qData[8].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-7 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[9] ? qData[9].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-8 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[10] ? qData[10].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-9 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[11] ? qData[11].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-10 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[12] ? qData[12].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-11 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[13] ? qData[13].queueCode : ''}</b>
//                   </big>
//                 </div>
//                 <div className="col-span-2 col-start-5 row-start-12 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//                   <big>
//                     <b>{qData[14] ? qData[14].queueCode : ''}</b>
//                   </big>
//                 </div>
//               </div>
//             </main>
//           );
//         }
//       })()}

//       <footer className="fixed inset-x-0 bottom-0 h-8 bg-pink-500 text-center text-2xl text-white">
//         <Marquee direction="left" autoFill={false} speed={50}>
//           {marquee}
//         </Marquee>
//       </footer>

//     </div>
//   );
// };
// export default Queue;

// // {queue.filter((item) => item.channel2 === Number(`${id}`)).map((employee, index) => {
// //   // employee.filter((qitem: { channel2: string | string[]; }) => qitem.channel2.includes(`${id}`))
// //   return (
// //     <div key={index}>
// //       <p>{employee.queueCode}</p>
// //       {/* <p>{employee.address}</p>
// //       <p>{employee.gender}</p> */}
// //     </div>
// //   )
// // })}

'use client';

import Image from 'next/image';
import React, { use } from 'react';
import Marquee from 'react-fast-marquee';

import useApi from '@/hooks/useApi';
import { socketClient } from '@/services/sockio';
import moph from '#/public/assets/udh/logo_MOPH.png';
import logo from '#/public/assets/udh/LOGO2.png';

// const Queue = ({ params }: { params: { slug: string } }) => {
//   const chock = `/assets/udh/UDH${params.slug}.png`;
const Queue = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params); // ใช้ use() แทน await
  const chock = `/assets/udh/UDH${slug}.png`;
  const [todate, setTodate] = React.useState('');
  const [queue, setQueue] = React.useState([]);
  const [marquee, setMarquee] = React.useState<string>();

  React.useEffect(() => {
    socketClient.on('queue', (arg: { data: React.SetStateAction<never[]> }) => {
      setQueue(arg.data); // arg คือ data ที่มาจาก Server
    });
    socketClient.on('todate', (arg: React.SetStateAction<string>) => {
      setTodate(arg); // arg คือ data ที่มาจาก Server
    });
    return () => {
      socketClient.off('queue');
      socketClient.off('todate');
      // socketClient.disconnect();
    };
  }, []);

  const qData: any = queue.filter((item: any) => item.channel2 === Number(`${slug}`));

  const getMsgApi = useApi({
    key: ['config'],
    method: 'GET',
    url: `medicine/configures`,
  })?.get;

  React.useEffect(() => {
    getMsgApi?.refetch();
  });

  React.useEffect(() => {
    setMarquee(getMsgApi?.data?.data[0]?.hospital_message);
  }, [getMsgApi?.data]);

  return (
    <div className="flex h-screen flex-col">
      <header className="h-1/5 bg-pink-500 text-center">
        <br />
        <div className="m-1 grid grow grid-cols-5 grid-rows-5 gap-2 text-white">
          <div className="row-span-3 mt-[-26px] flex place-items-baseline justify-center">
            <Image src={logo} alt="Logo" width={140} height={140} />
          </div>
          <div className="col-span-2 row-span-2 mr-[-80px] mt-[-20px] flex place-items-baseline justify-center md:text-4xl lg:text-8xl xl:text-7xl 2xl:text-8xl">
            <big>
              <b>ช่องบริการ</b>
            </big>
          </div>
          <div className="z-20 col-start-4 row-span-3 -ml-0 mt-[-25px]">
            <Image src={chock} alt="Logo" width={250} height={250} />
          </div>
          <div className="col-span-2 col-start-2 row-start-3 mr-[-65px]  mt-[-50px] flex justify-center text-amber-100 md:text-xl lg:text-2xl ">
            <b>
              <div suppressHydrationWarning>
                {todate}
              </div>
            </b>
          </div>
          <div className="col-start-5 row-span-3 row-start-1 mt-[-26px] flex place-items-baseline  justify-center">
            <Image src={moph} alt="Logo" width={140} height={140} />
          </div>
        </div>
      </header>
      {(() => {
        if ( slug=== '32') {
          return (
            <main className="m-1 flex h-3/4 justify-center bg-[url(/images/back.png)] text-center text-blue-900">
              <div className="flex h-full items-center">

                <h1 className="font-extrabold uppercase tracking-[0.5rem] sm:text-[9rem] md:text-[12] lg:text-[14rem] 2xl:text-[18rem]" style={{ textShadow: '4px 10px 10px #ffc107' }}><b>ยื่นใบสั่งยา</b></h1>

              </div>
            </main>
          );
        } else {
          return (
            <main className="m-1 flex h-3/4 bg-pink-100">
              <div className="grid w-full grow grid-cols-4 grid-rows-12 gap-2 text-blue-800">
                <div className="row-span-2 flex h-[88px] items-center justify-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
                  <b>
                    <big>คิวที่</big>
                  </b>
                </div>
                <div className="col-start-1 row-span-2 row-start-3 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

                  <big>{ qData[0] ? qData[0]?.queueCode : ''}</big>

                </div>
                <div className="col-start-1 row-span-2 row-start-5 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

                  <big>{ qData[1] ? qData[1].queueCode : ''}</big>

                </div>
                <div className="col-start-1 row-span-2 row-start-7 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

                  <big>{ qData[2] ? qData[2].queueCode : ''}</big>

                </div>
                <div className="col-start-1 row-span-2 row-start-9 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

                  <big>{ qData[3] ? qData[3].queueCode : ''}</big>

                </div>
                <div className="col-start-1 row-span-2 row-start-11 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

                  <big>{ qData[4] ? qData[4].queueCode : ''}</big>

                </div>
                <div className="col-span-3 col-start-2 row-span-2 row-start-1 flex h-[88px] items-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
                  <b>
                    <big>ชื่อ สกุล</big>
                  </b>
                </div>
                <div className="col-span-3 col-start-2 row-span-2 row-start-3 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
                  <big>
                    <b>
                      { qData[0] ? qData[0].fullName : ''}
                    </b>
                  </big>
                </div>
                <div className="col-span-3 col-start-2 row-span-2 row-start-5 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
                  <big>
                    <b>
                      { qData[1] ? qData[1].fullName : ''}
                    </b>
                  </big>
                </div>
                <div className="col-span-3 col-start-2 row-span-2 row-start-7 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
                  <big>
                    <b>
                      { qData[2] ? qData[2].fullName : ''}
                    </b>
                  </big>
                </div>
                <div className="col-span-3 col-start-2 row-span-2 row-start-9 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
                  <big>
                    <b>
                      { qData[3] ? qData[3].fullName : ''}
                    </b>
                  </big>
                </div>
                <div className="col-span-3 col-start-2 row-span-2 row-start-11 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
                  <big>
                    <b>
                      { qData[4] ? qData[4].fullName : ''}
                    </b>
                  </big>
                </div>
                {/* <div className="h-26 col-start-4 row-span-2 row-start-1 flex items-center justify-center rounded-lg bg-green-500 text-white md:text-2xl lg:text-4xl xl:text-6xl"> */}
                <div className="col-span-2 col-start-5 row-span-4 row-start-1 flex h-[88px] items-center justify-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
                  <b>
                    <big>คิวก่อน</big>
                  </b>
                </div>
                <div className="col-span-2 col-start-5 row-start-3 flex items-center justify-center  rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[5] ? qData[5].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-4 flex items-center justify-center  rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[6] ? qData[6].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-5 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[7] ? qData[7].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-6 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[8] ? qData[8].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-7 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[9] ? qData[9].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-8 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[10] ? qData[10].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-9 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[11] ? qData[11].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-10 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{qData[12] ? qData[12].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-11 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{ qData[13] ? qData[13].queueCode : ''}</b>
                  </big>
                </div>
                <div className="col-span-2 col-start-5 row-start-12 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
                  <big>
                    <b>{qData[14] ? qData[14].queueCode : ''}</b>
                  </big>
                </div>
              </div>
            </main>
          );
        }
      })()}

      <footer className="fixed inset-x-0 bottom-0 h-8 bg-pink-500 text-center text-2xl text-white">
        <Marquee direction="left" autoFill={false} speed={50}>
          {marquee}
        </Marquee>
      </footer>

    </div>
  );
};
export default Queue;

// {queue.filter((item) => item.channel2 === Number(`${id}`)).map((employee, index) => {
//   // employee.filter((qitem: { channel2: string | string[]; }) => qitem.channel2.includes(`${id}`))
//   return (
//     <div key={index}>
//       <p>{employee.queueCode}</p>
//       {/* <p>{employee.address}</p>
//       <p>{employee.gender}</p> */}
//     </div>
//   )
// })}
