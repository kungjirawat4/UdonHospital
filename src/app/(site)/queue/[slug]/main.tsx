// const MainQueue = (data: { data: any }) => {
//   return (
//     <main className="m-1 flex h-3/4 bg-pink-100">
//       <div className="grid w-full grow grid-cols-4 grid-rows-12 gap-2 text-blue-800">
//         <div className="row-span-2 flex h-[88px] items-center justify-center rounded-lg bg-green-800 text-white md:text-2xl lg:text-4xl xl:text-5xl">
//           <b>
//             <big>คิวที่</big>
//           </b>
//         </div>
//         <div className="col-start-1 row-span-2 row-start-3 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

//           <b>{data?.data?.queueObj[0] ? data?.data?.queueObj[0].queueCode : '' }</b>
//           {/* <b>{isVisible && data?.data?.queueObj[0] ? data?.data?.queueObj[0].queueCode : ''}</b> */}

//         </div>
//         <div className="col-start-1 row-span-2 row-start-5 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

//           <b>{data?.data?.queueObj[1] ? data?.data?.queueObj[1].queueCode : '' }</b>

//         </div>
//         <div className="col-start-1 row-span-2 row-start-7 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

//           <b>{data?.data?.queueObj[2] ? data?.data?.queueObj[2].queueCode : '' }</b>

//         </div>
//         <div className="col-start-1 row-span-2 row-start-9 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

//           <b>{data?.data?.queueObj[3] ? data?.data?.queueObj[3].queueCode : '' }</b>

//         </div>
//         <div className="col-start-1 row-span-2 row-start-11 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

//           <b>{data?.data?.queueObj[4] ? data?.data?.queueObj[4].queueCode : '' }</b>

//         </div>
//         <div className="col-span-3 col-start-2 row-span-2 row-start-1 flex h-[88px] items-center justify-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
//           <b>
//             <big>ชื่อ สกุล</big>
//           </b>
//         </div>
//         <div className="col-span-3 col-start-2 row-span-2 row-start-3 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
//           <big>
//             <b>
//               {data?.data?.queueObj[0] ? data?.data?.queueObj[0].fullName : '' }
//             </b>
//           </big>
//         </div>
//         <div className="col-span-3 col-start-2 row-span-2 row-start-5 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
//           <big>
//             <b>
//               {data?.data?.queueObj[1] ? data?.data?.queueObj[1].fullName : '' }
//             </b>
//           </big>
//         </div>
//         <div className="col-span-3 col-start-2 row-span-2 row-start-7 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
//           <big>
//             <b>
//               {data?.data?.queueObj[2] ? data?.data?.queueObj[2].fullName : '' }
//             </b>
//           </big>
//         </div>
//         <div className="col-span-3 col-start-2 row-span-2 row-start-9 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
//           <big>
//             <b>
//               {data?.data?.queueObj[3] ? data?.data?.queueObj[3].fullName : '' }
//             </b>
//           </big>
//         </div>
//         <div className="col-span-3 col-start-2 row-span-2 row-start-11 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
//           <big>
//             <b>
//               {data?.data?.queueObj[4] ? data?.data?.queueObj[4].fullName : '' }
//             </b>
//           </big>
//         </div>
//         {/* <div className="h-26 col-start-4 row-span-2 row-start-1 flex items-center justify-center rounded-lg bg-green-500 text-white md:text-2xl lg:text-4xl xl:text-6xl"> */}
//         <div className="col-span-2 col-start-5 row-span-4 row-start-1 flex h-[88px] items-center justify-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
//           <b>
//             <big>คิวก่อน</big>
//           </b>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-3 flex items-center justify-center  rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[0] ? data?.data?.queue10[0].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-4 flex items-center justify-center  rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[1] ? data?.data?.queue10[1].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-5 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[2] ? data?.data?.queue10[2].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-6 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[3] ? data?.data?.queue10[3].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-7 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[4] ? data?.data?.queue10[4].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-8 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[5] ? data?.data?.queue10[5].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-9 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[6] ? data?.data?.queue10[6].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-10 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[7] ? data?.data?.queue10[7].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-11 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[8] ? data?.data?.queue10[8].queueCode : '' }</b>
//           </big>
//         </div>
//         <div className="col-span-2 col-start-5 row-start-12 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
//           <big>
//             <b>{data?.data?.queue10[9] ? data?.data?.queue10[9].queueCode : '' }</b>
//           </big>
//         </div>
//       </div>
//     </main>
//   );
// };
// export default MainQueue;

const MainQueue = (data: { data: any }) => {
  return (
    <main className="m-1 flex h-3/4 bg-pink-100">
      <div className="grid w-full grow grid-cols-4 grid-rows-12 gap-2 text-blue-800">
        <div className="row-span-2 flex h-[88px] items-center justify-center rounded-lg bg-green-800 text-white md:text-2xl lg:text-4xl xl:text-5xl">
          <b>
            <big>คิวที่</big>
          </b>
        </div>
        <div className="col-start-1 row-span-2 row-start-3 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

          <b>{data?.data?.queueObj[0] ? data?.data?.queueObj[0].queueCode : '' }</b>
          {/* <b>{isVisible && data?.data?.queueObj[0] ? data?.data?.queueObj[0].queueCode : ''}</b> */}

        </div>
        <div className="col-start-1 row-span-2 row-start-5 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

          <b>{data?.data?.queueObj[1] ? data?.data?.queueObj[1].queueCode : '' }</b>

        </div>
        <div className="col-start-1 row-span-2 row-start-7 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

          <b>{data?.data?.queueObj[2] ? data?.data?.queueObj[2].queueCode : '' }</b>

        </div>
        <div className="col-start-1 row-span-2 row-start-9 flex items-center justify-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-8xl">

          <b>{data?.data?.queueObj[3] ? data?.data?.queueObj[3].queueCode : '' }</b>

        </div>
        <div className="col-start-1 row-span-2 row-start-11 flex items-center justify-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-8xl">

          <b>{data?.data?.queueObj[4] ? data?.data?.queueObj[4].queueCode : '' }</b>

        </div>
        <div className="col-span-3 col-start-2 row-span-2 row-start-1 flex h-[88px] items-center justify-center rounded-lg bg-green-800 font-extrabold text-white md:text-2xl lg:text-4xl xl:text-5xl">
          <b>
            <big>ชื่อ สกุล</big>
          </b>
        </div>
        <div className="col-span-3 col-start-2 row-span-2 row-start-3 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
          <big>
            <b>
              {data?.data?.queueObj[0] ? data?.data?.queueObj[0].fullName : '' }
            </b>
          </big>
        </div>
        <div className="col-span-3 col-start-2 row-span-2 row-start-5 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
          <big>
            <b>
              {data?.data?.queueObj[1] ? data?.data?.queueObj[1].fullName : '' }
            </b>
          </big>
        </div>
        <div className="col-span-3 col-start-2 row-span-2 row-start-7 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
          <big>
            <b>
              {data?.data?.queueObj[2] ? data?.data?.queueObj[2].fullName : '' }
            </b>
          </big>
        </div>
        <div className="col-span-3 col-start-2 row-span-2 row-start-9 flex items-center truncate rounded-lg bg-amber-500 font-extrabold md:text-6xl lg:text-7xl">
          <big>
            <b>
              {data?.data?.queueObj[3] ? data?.data?.queueObj[3].fullName : '' }
            </b>
          </big>
        </div>
        <div className="col-span-3 col-start-2 row-span-2 row-start-11 flex items-center truncate rounded-lg bg-white font-extrabold md:text-6xl lg:text-7xl">
          <big>
            <b>
              {data?.data?.queueObj[4] ? data?.data?.queueObj[4].fullName : '' }
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
            <b>{data?.data?.queue10[0] ? data?.data?.queue10[0].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-4 flex items-center justify-center  rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[1] ? data?.data?.queue10[1].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-5 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[2] ? data?.data?.queue10[2].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-6 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[3] ? data?.data?.queue10[3].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-7 flex items-center justify-center rounded-lg  bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[4] ? data?.data?.queue10[4].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-8 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[5] ? data?.data?.queue10[5].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-9 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[6] ? data?.data?.queue10[6].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-10 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[7] ? data?.data?.queue10[7].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-11 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[8] ? data?.data?.queue10[8].queueCode : '' }</b>
          </big>
        </div>
        <div className="col-span-2 col-start-5 row-start-12 flex items-center justify-center rounded-lg bg-red-100 md:text-4xl lg:text-5xl">
          <big>
            <b>{data?.data?.queue10[9] ? data?.data?.queue10[9].queueCode : '' }</b>
          </big>
        </div>
      </div>
    </main>
  );
};
export default MainQueue;
