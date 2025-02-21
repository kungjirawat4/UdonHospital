'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import useUserInfoStore from '@/zustand/userStore'
import FormContainer from '@/components/form-container'
import Message from '@/components/message'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import CustomFormField, { FormButton } from '@/components/custom-form'
import ApiCall from '@/services/api'
import QRScanner from '@/components/qrscanner/QRScanner'
import { Button, Modal, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import jsQR from 'jsqr'
import WebcamCapture from '@/components/qrscanner/WebcamCapture'
import { BsQrCode } from 'react-icons/bs'


const Page = () => {
  const router = useRouter()
  const params = useSearchParams().get('next')

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [qrCode, setQrCode] = React.useState("");

  const postApi = ApiCall({
    key: ['login'],
    method: 'POST',
    url: `auth/login`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      const { id, email, menu, routes, token, name, mobile, role, image } =
        postApi.data
      updateUserInfo({
        id,
        email,
        menu,
        routes,
        token,
        name,
        mobile,
        role,
        image,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo.id && router.push((params as string) || '/medicine')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userInfo.id])

  const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    postApi?.mutateAsync(values)
  }


  const handleScan = (imageSrc: string) => {
    if (imageSrc) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code: any = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
        if (code) {
          setQrCode(code);
          const reqUrl: string = code.data
          const { searchParams } = new URL(reqUrl)
          const email = searchParams.get("email");
          const password = searchParams.get("password")
          postApi?.mutateAsync({ email, password })
          // console.log(searchParams.get("password")) // should print lorem
        }
      }
    }
  }


  return (

    <>
      <FormContainer title='เข้าสู่ระบบ'>
        {postApi?.isError && <Message value={postApi?.error} />}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <CustomFormField
              form={form}
              name='email'
              label='อีเมล์'
              placeholder='กรุณากรอกอีเมล์' />
            <CustomFormField
              form={form}
              name='password'
              label='รหัสผ่าน'
              placeholder='กรุณากรอกรหัสผ่าน'
              type='password' />

            <div className="grid grid-cols-4 gap-4">
              <div className='col-span-3'>
                <FormButton
                  loading={postApi?.isPending}
                  label='เข้าสู่ระบบ'
                  className='w-full' />
              </div>
              <Button color="danger" startContent={<BsQrCode size={20} />} variant="bordered" onPress={onOpen}>QR</Button>

            </div>
            {/* <Button color="primary" onPress={onOpen}>
           QR Scan
          </Button> */}

            {/* < */}
            {/* label='QR Scan'
            className='w-full'
            type='button'
            variant='outline'
            icon=
            onClick={onOpen} /> */}


            <FormButton
              label='สมัครสมาชิก'
              className='w-full'
              type='button'
              variant='outline'
              onClick={() => router.push('/auth/register')} />
          </form>

        </Form>

        <div className='row pt-3'>
          <div className='col'>
            <Link href='/auth/forgot-password' className='ps-1'>
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </div>
      </FormContainer>
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        size={'xl'}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >

        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">กรุณานำ QR Code มาแสกน </ModalHeader>
              <WebcamCapture onScan={handleScan} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Page
