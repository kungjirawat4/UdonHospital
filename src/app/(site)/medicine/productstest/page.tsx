'use client';

import { Upload } from "@/components/custom-form";
import React, { useEffect } from "react";
import Image from 'next/image'

const productPage = () => {
   const [fileLink, setFileLink] = React.useState<string[]>([])
  
   useEffect(() => {
     
    setFileLink([])
      // eslint-disable-next-line
    }, [])
    console.log(fileLink)
  return(
     <div className='w-full md:w-[48%] lg:w-[32%]'>
                    <Upload
                      multiple
                      label='Image'
                      setFileLink={setFileLink}
                      fileLink={fileLink}
                      fileType='image'
                    />
                    {fileLink?.length > 0 && (
                      <div className='avatar text-center flex justify-center items-end mt-2'>
                        <div className='w-12 mask mask-squircle'>
                          <Image
                            src={fileLink?.[0]}
                            alt='image1'
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                            className='rounded-full'
                          />
                          <Image
                            src={fileLink?.[1]}
                            alt='image2'
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                            className='rounded-full'
                          />
                          <Image
                            src={fileLink?.[2]}
                            alt='image3'
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                            className='rounded-full'
                          />
                        </div>
                      </div>
                    )}
     </div>
   )
}

export default productPage;