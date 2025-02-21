'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

import { useIsClient } from '@/hooks/use-is-client';
import React, { useEffect, useRef } from 'react';
import { socketClient } from '@/services/sockio';
import useUserInfoStore from '@/zustand/userStore';
import useAuthorization from '@/hooks/useAuthorization';
import { useRouter } from 'next/navigation';

import { useReactToPrint } from 'react-to-print';
import PrintPage from '@/components/screens/prints/dashboard';
import { ReactECharts } from '../dashboard/React-ECharts';
import { RecentUserTop } from '../dashboard/recent-user-top';
import { RecentUser } from '../dashboard/recent-user';
import Navbars from './navbar';

export default function WorkloadView() {
    const isClient = useIsClient();
    const path = useAuthorization()
    const router = useRouter()

    const [config, setConfig] = React.useState(''); 
    const [dashboard, setDashboard] = React.useState<any>([]); 
    const [session, setSession] =  React.useState<any>([]); 
    const [todate, setTodate] = React.useState('');

    const { userInfo } = useUserInfoStore((state) => state)
    React.useEffect(() => {

      socketClient.on('todate', (arg: React.SetStateAction<string>) => {
        setTodate(arg); // arg คือ data ที่มาจาก Server
      });

      socketClient.on('users', (arg) => {
        setSession(arg.session); // arg คือ data ที่มาจาก Server
      });

      return () => {
        socketClient.off('today');
        socketClient.off('users');
        socketClient.disconnect();
      }
  }, [])

  return (
    <>
    <div className="m-2 h-[297mm] w-[210mm] overflow-hidden rounded-md bg-white p-8 shadow-lg print:m-0 print:h-screen print:w-screen print:rounded-none print:shadow-none">
      <Navbars/>
      <div className="hidden items-center space-x-2 md:flex">
          <div suppressHydrationWarning>
              {todate}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 text-xs">      
          <RecentUserTop data={session} />
        </div>
    </div>
    </>
  );
}
