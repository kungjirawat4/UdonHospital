'use client';
import '@/styles/a4.css'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

import { ReactECharts } from './React-ECharts';
import { RecentUser } from './recent-user';
import Spinner from '@/components/spinner';
import { useIsClient } from '@/hooks/use-is-client';
import React, { useEffect, useRef } from 'react';
import { socketClient } from '@/services/sockio';
import useUserInfoStore from '@/zustand/userStore';
import useAuthorization from '@/hooks/useAuthorization';
import { useRouter } from 'next/navigation';
import { RecentUserTop } from './recent-user-top';
import { useReactToPrint } from 'react-to-print';

export default function HomeView() {
    const isClient = useIsClient();
    const path = useAuthorization()
    const router = useRouter()

    const printViewRef = useRef(null);
  const handlePrint = useReactToPrint({
      contentRef: printViewRef,
      onAfterPrint: () => {
          console.log('ok พิมพ์เสร็จแล้ว')
      }
    });

    useEffect(() => {
        if (path) {
          router.push(path)
        }
      }, [path, router])


    const [config, setConfig] = React.useState(''); 
    const [dashboard, setDashboard] = React.useState<any>([]); 

   const [session, setSession] =  React.useState<any>([]); 

   const [user, setUser] =  React.useState<any>([]); 

    const { userInfo } = useUserInfoStore((state) => state)
    React.useEffect(() => {
      socketClient.on('config', (arg) => {
        setConfig(arg); // arg คือ data ที่มาจาก Server
      });

      socketClient.on('dashboard', (arg) => {
        setDashboard(arg); // arg คือ data ที่มาจาก Server
      });

      socketClient.on('session', (arg) => {
        setSession(arg.session); // arg คือ data ที่มาจาก Server
        setUser(arg.users); // arg คือ data ที่มาจาก Server
      });

      socketClient.on('user', (arg) => {
        setUser(arg); // arg คือ data ที่มาจาก Server
      });
      return () => {
        socketClient.off('config');
        socketClient.off('dashboard');
        socketClient.off('session');
        // socketClient.disconnect();
      }
  }, [])


   const pies = {
    // title: {
    //   text: 'รับบริการประจำวัน',
    //   // subtext: 'Fake Data',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      // orient: 'vertical',
      left: 'center',
    },
    series: [
      {
        name: 'ห้องยา OPD',
        type: 'pie',
        radius: '50%',
        data: [
          {
            value: dashboard?.a,
            name: 'A ทั่วไป',
            itemStyle: {
              color: '#5470c6',
            },
          },
          {
            value: dashboard?.b,
            name: 'B รับคำปรึกษา',
            itemStyle: {
              color: '#ee6666',
            },
          },
          {
            value: dashboard?.c,
            name: 'C ทั่วไป',
            itemStyle: {
              color: '#91cc75',
            },
          },
          {
            value: dashboard?.d,
            name: 'D จิตเวช',
            itemStyle: {
              color: '#fac858',
            },
          },
          // {
          //   value: dashboard?.f,
          //   name: 'F',
          //   itemStyle: {
          //     color: '#fac858',
          //   },
          // },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const hours = {
    // title: {
    //   text: 'รับบริการรายชั่วโมง',
    //   subtext: 'Fake Data',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'category',
      data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [dashboard?.h8, dashboard?.h9, dashboard?.h10, dashboard?.h11, dashboard?.h12, dashboard?.h13, dashboard?.h14, dashboard?.h15, dashboard?.h16, dashboard?.h17, dashboard?.h18, dashboard?.h19, dashboard?.h20],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        itemStyle: {
          color: '#ee6666',
        },
      },
    ],
  };

  const days = {
    // title: {
    //   text: 'รับบริการรายชั่วโมง',
    //   subtext: 'Fake Data',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'category',
      data: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์',],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [dashboard?.Daysofweek?.Monday, dashboard?.Daysofweek?.Tuesday, dashboard?.Daysofweek?.Wednesday,dashboard?.Daysofweek?.Thursday, dashboard?.Daysofweek?.friday],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        itemStyle: {
          color: '#91cc75',
        },
      },
    ],
  };

  const rotation = {
    // title: {
    //   text: 'ผู้รับยาตามประเภท',
    //   // subtext: 'Fake Data',
    //   left: 'left',
    // },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['A', 'B', 'C', 'D'],
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: [
          'ม.ค',
          'ก.พ',
          'มี.ค',
          'พ.ค',
          'มิ.ย',
          'ก.ค',
          'ส.ค',
          'ก.ย',
          'ต.ค',
          'พ.ย',
          'ธ.ค',
        ],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'A',
        type: 'bar',
        barGap: 0,
        label: {
          show: false,
          position: 'inside',
        },
        itemStyle: {
          color: '#5470c6',
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          dashboard?.MonthofYearA?.JanA, dashboard?.MonthofYearA?.FebA, dashboard?.MonthofYearA?.MarA, 
          dashboard?.MonthofYearA?.AprA, dashboard?.MonthofYearA?.MayA, dashboard?.MonthofYearA?.JunA,
          dashboard?.MonthofYearA?.JulA, dashboard?.MonthofYearA?.AugA, dashboard?.MonthofYearA?.SeptA,
          dashboard?.MonthofYearA?.OctA, dashboard?.MonthofYearA?.NovA, dashboard?.MonthofYearA?.DecemberA
        ],
      },
      {
        name: 'B',
        type: 'bar',
        // label: labelOption,
        label: {
          show: false,
          position: 'inside',
        },
        itemStyle: {
          color: '#ee6666',
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          dashboard?.MonthofYearB?.JanB, dashboard?.MonthofYearB?.FebB, dashboard?.MonthofYearB?.MarB, 
          dashboard?.MonthofYearB?.AprB, dashboard?.MonthofYearB?.MayB, dashboard?.MonthofYearB?.JunB,
          dashboard?.MonthofYearB?.JulB, dashboard?.MonthofYearB?.AugB, dashboard?.MonthofYearB?.SeptB,
          dashboard?.MonthofYearB?.OctB, dashboard?.MonthofYearB?.NovB, dashboard?.MonthofYearB?.DecemberB
        ],
      },
      {
        name: 'C',
        type: 'bar',
        // label: labelOption,
        label: {
          show: false,
          position: 'inside',
        },
        emphasis: {
          focus: 'series',
        },
        itemStyle: {
          color: '#91cc75',
        },
        data: [
          dashboard?.MonthofYearC?.JanC, dashboard?.MonthofYearC?.FebC, dashboard?.MonthofYearC?.MarC, 
          dashboard?.MonthofYearC?.AprC, dashboard?.MonthofYearC?.MayC, dashboard?.MonthofYearC?.JunC,
          dashboard?.MonthofYearC?.JulC, dashboard?.MonthofYearC?.AugC, dashboard?.MonthofYearC?.SeptC,
          dashboard?.MonthofYearC?.OctC, dashboard?.MonthofYearC?.NovC, dashboard?.MonthofYearC?.DecemberC
        ],
      },
      {
        name: 'D',
        type: 'bar',
        // label: labelOption,
        label: {
          show: false,
          position: 'inside',
        },
        itemStyle: {
          color: '#fac858',
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          dashboard?.MonthofYearD?.JanD, dashboard?.MonthofYearD?.FebD, dashboard?.MonthofYearD?.MarD, 
          dashboard?.MonthofYearD?.AprD, dashboard?.MonthofYearD?.MayD, dashboard?.MonthofYearD?.JunD,
          dashboard?.MonthofYearD?.JulD, dashboard?.MonthofYearD?.AugD, dashboard?.MonthofYearD?.SeptD,
          dashboard?.MonthofYearD?.OctD, dashboard?.MonthofYearD?.NovD, dashboard?.MonthofYearD?.DecemberD
        ],
      },
    ],
  };
  
  if (!isClient) {
    return <Spinner />;
  }

  return (
   
    <div className="flex-1 space-y-4 p-4">
        <div style={{display: 'none'}} >
       <div ref={printViewRef}>
    <div className="page" id="page-one">
    <div className="print-area">
        <h1>Hello from page 1</h1>
      </div>
    </div>
    <div className="page" id="page-two">
    <div className="print-area">
        <h1>Hello from page 2</h1>
      </div>
    </div>
    </div>
    </div>
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">
        สวัสดี
        {' '}
        {userInfo ? userInfo.name : ''}
        , ยินดีตอนรับ 👋
      </h2>
      <div className="hidden items-center space-x-2 md:flex">
        {/* <CalendarDateRangePicker /> */}
        {/* <Button
          className="shadow-none"
          variant="outline"
          onClick={() =>
            toast('Event has been created', {
              // description: 'Sunday, December 03, 2023 at 9:00 AM',
              data: {
                label: 'Undo',
                // eslint-disable-next-line no-console
                onClick: () => console.log('Undo'),
              },
            })}
        >
          Add to Calendar
        </Button> */}
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Download className="mr-2 size-4" />
              Download
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm</DialogTitle>
              <DialogDescription>
                What do you want to get done today?
              </DialogDescription>
            </DialogHeader>
            <form id="todo-form" className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="title"
                  name="title"
                  placeholder="Todo title..."
                  className="col-span-4"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description..."
                  className="col-span-4"
                />
              </div>
            </form>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button type="submit" size="sm" form="todo-form">
                  Confirm
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <button onClick={() => handlePrint()} >print</button>
      </div>
    </div>
         
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
        <TabsTrigger value="analytics">สถานะใบสั่งยา</TabsTrigger>
        <TabsTrigger value="reports">ข้อมูลสต๊อกยา</TabsTrigger>
        <TabsTrigger value="user">ผู้ใช้งาน</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                กำลังคัดกรอง
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="size-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.status1}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last date
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">กำลังจับคู่ตะกร้า</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="size-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#ff646c]">{dashboard.status2}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                กำลังจัดยา
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="size-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#11c678]">{dashboard.status3}</div>
              <p className="text-xs text-muted-foreground">
                +19% from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">กำลังตรวจสอบยา</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="size-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.status4}</div>
              <p className="text-xs text-muted-foreground">
                +21 since last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">กำลังเรียกคิว</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="size-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#11c678]">{dashboard.status5}</div>
              <p className="text-xs text-muted-foreground">
                +21 since last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">จ่ายยาสำเร็จ</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="size-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#11c678]">{dashboard.status6}</div>
              <p className="text-xs text-muted-foreground">
                +21 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        
          <Card>
            <CardHeader>
              <CardTitle>กลุ่มรับบริการ</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ReactECharts option={pies} style={{ height: '350px' }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>รายชั่วโมง</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts option={hours} style={{ height: '350px' }} />
            </CardContent>
          </Card>
          
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ประจำวัน</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts option={days} style={{ height: '350px' }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ประจำเดือน</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ReactECharts option={rotation} style={{ height: '350px' }} />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <Card>
            <CardHeader>
              <CardTitle>Maximum workload</CardTitle>
              {/* <CardDescription>
                login ล่าสุด
              </CardDescription> */}
            </CardHeader>
            <CardContent>
             <RecentUserTop data={user} />
            </CardContent>
          </Card>
        </div>
        
      </TabsContent>
      <TabsContent value="analytics" className="space-y-4">
        
      </TabsContent>
      <TabsContent value="reports" className="space-y-4">
        {/* <DrugPage /> */}
      </TabsContent>
      <TabsContent value="user" className="space-y-4">
      <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Latest login</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentUser data={session} />
            </CardContent>
          </Card>
      </TabsContent>
    </Tabs>
 
  
  </div>
  );
}
