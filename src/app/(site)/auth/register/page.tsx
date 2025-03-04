'use client'
import React, { useEffect } from 'react'
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
import Link from 'next/link'

const FormSchema = z
  .object({
    name: z.string().refine((value) => value !== '', {
      message: 'Name is required',
    }),
    email: z.string().email(),
    password: z.string().refine((val) => val.length > 6, {
      message: "Password can't be less than 6 characters",
    }),
    confirmPassword: z.string().refine((val) => val.length > 6, {
      message: "Confirm password can't be less than 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  })

const Page = () => {
  const router = useRouter()
  const params = useSearchParams().get('next')

  const { userInfo } = useUserInfoStore((state) => state)

  const postApi = ApiCall({
    key: ['register'],
    method: 'POST',
    url: `auth/register`,
  })?.post

  useEffect(() => {
    userInfo.id && router.push((params as string) || '/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userInfo.id])

  useEffect(() => {
    if (postApi?.isSuccess) {
      form.reset()
    }
    // eslint-disable-next-line
  }, [postApi?.isSuccess, router])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    postApi?.mutateAsync(values)
  }
  console.log(postApi?.data)
  return (
    <FormContainer title='สมัครสมาชิก'>
      {postApi?.isError && <Message value={postApi?.error} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <CustomFormField
            form={form}
            name='name'
            label='ชื่อ-นามสกุล'
            placeholder='ชื่อ-นามสกุล'
            type='text'
          />
          <CustomFormField
            form={form}
            name='email'
            label='อีเมล์'
            placeholder='กรุณากรอกอีเมล์'
          />
          <CustomFormField
            form={form}
            name='password'
            label='รหัสผ่าน'
            placeholder='รหัสผ่าน'
            type='password'
          />
          <CustomFormField
            form={form}
            name='confirmPassword'
            label='ยืนยันรหัสผ่าน'
            placeholder='ยืนยันรหัสผ่าน'
            type='password'
          />

          <FormButton
            loading={postApi?.isPending}
            label='สมัครสมาชิก'
            className='w-full'
          />
          <FormButton
            label='เข้าสู่ระบบ'
            className='w-full'
            type='button'
            variant='outline'
            onClick={() => router.push('/auth/login')}
          />
        </form>
      </Form>

      {postApi?.isSuccess && (
        <div className='text-green-500 text-center mt-5'>

          <Link href={postApi?.data?.confirm}>กรุณาตรวจสอบอีเมล์ของคุณเพื่อยืนยันบัญชีของคุณ!</Link>
        </div>

      )}
    </FormContainer>
  )
}

export default Page
