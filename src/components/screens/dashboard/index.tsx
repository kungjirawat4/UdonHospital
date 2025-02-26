'use client';
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
import PrintPage from '@/components/screens/prints/dashboard';
import Image from 'next/image';
import WorkloadView from '../prints/workload';
import DrugPage from './drug/page';
import PrescriptionPage from './prescription/page';
import { FaPrint } from 'react-icons/fa6';
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

  const [session, setSession] = React.useState<any>([]);

  const [user, setUser] = React.useState<any>([]);

  const { userInfo } = useUserInfoStore((state) => state)
  React.useEffect(() => {
    // socketClient.on('config', (arg) => {
    //   setConfig(arg); // arg คือ data ที่มาจาก Server
    // });

    socketClient.on('dashboard', (arg) => {
      setDashboard(arg); // arg คือ data ที่มาจาก Server
    });

    socketClient.on('users', (arg) => {
      setUser(arg.users); // arg คือ data ที่มาจาก Server
      setSession(arg.session)
    });
    return () => {
      // socketClient.off('config');
      socketClient.off('dashboard');
      socketClient.off('users');
      // socketClient.disconnect();
    }
  }, [])
  // console.log(user, session)

  const pies = {
    // title: {
    //   text: 'รับบริการประจำวัน',
    //   // subtext: 'Fake Data',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      // orient: 'vertical',
      left: 'center',
    },
    series: [
      {
        name: 'ห้องยา OPD',
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['0%', '70%'],
        label: {
          position: 'center',
          textStyle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFF',
          },
        },
        data: [
          {
            value: dashboard?.a,
            name: 'A ทั่วไป',
            itemStyle: {
              color: '#5470c6',
            },
            label: {
              // Options: 'left', 'right', 'top', 'bottom', 'inside', 'insideTop', 'insideLeft', 'insideRight', 'insideBottom', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
              // position: 'top',
              position: 'inner',
              distance: 10,
              show: true,
              formatter: '{d}%',
              backgroundColor: '#5470c6',
              // borderColor: '#555',
              // borderWidth: 2,
              // borderRadius: 5,
              // padding: 10,
              fontSize: 18,
              // shadowBlur: 3,
              // shadowColor: '#888',
              // shadowOffsetX: 0,
              // shadowOffsetY: 3,
              textBorderColor: '#000',
              textBorderWidth: 3,
              color: '#fff'
            }
          },
          {
            value: dashboard?.b,
            name: 'B รับคำปรึกษา',
            itemStyle: {
              color: '#ee6666',
            },
            label: {
              // Options: 'left', 'right', 'top', 'bottom', 'inside', 'insideTop', 'insideLeft', 'insideRight', 'insideBottom', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
              position: 'top',
              distance: 10,
              show: true,
              formatter: '{d}%',
              backgroundColor: '#ee6666',
              // borderColor: '#555',
              // borderWidth: 2,
              // borderRadius: 5,
              // padding: 10,
              fontSize: 18,
              shadowBlur: 3,
              shadowColor: '#888',
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              textBorderColor: '#000',
              textBorderWidth: 3,
              color: '#fff'
            }
          },
          {
            value: dashboard?.c,
            name: 'C ทั่วไป',
            itemStyle: {
              color: '#91cc75',
            },
            label: {
              // Options: 'left', 'right', 'top', 'bottom', 'inside', 'insideTop', 'insideLeft', 'insideRight', 'insideBottom', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
              position: 'top',
              distance: 10,
              show: true,
              formatter: '{d}%',
              backgroundColor: '#91cc75',
              // borderColor: '#555',
              // borderWidth: 2,
              // borderRadius: 5,
              // padding: 10,
              fontSize: 18,
              shadowBlur: 3,
              shadowColor: '#888',
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              textBorderColor: '#000',
              textBorderWidth: 3,
              color: '#fff'
            },
          },
          {
            value: dashboard?.d,
            name: 'D จิตเวช',
            itemStyle: {
              color: '#fac858',
            },
            label: {
              // Options: 'left', 'right', 'top', 'bottom', 'inside', 'insideTop', 'insideLeft', 'insideRight', 'insideBottom', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
              position: 'top',
              distance: 10,
              show: true,
              formatter: '{d}%',
              backgroundColor: '#fac858',
              // borderColor: '#555',
              // borderWidth: 2,
              // borderRadius: 5,
              // padding: 10,
              fontSize: 18,
              shadowBlur: 3,
              shadowColor: '#888',
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              textBorderColor: '#000',
              textBorderWidth: 3,
              color: '#fff'
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
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false }
    },
    yAxis: {
      type: 'value',
      // minInterval: 1,
      // axisLabel: { showMaxLabel: false }
      // axisLabel: {
      //   formatter: '{value} ราย'
      // }
    },
    series: [
      {
        data: [dashboard?.h8, dashboard?.h9, dashboard?.h10, dashboard?.h11, dashboard?.h12, dashboard?.h13, dashboard?.h14, dashboard?.h15, dashboard?.h16, dashboard?.h17, dashboard?.h18, dashboard?.h19, dashboard?.h20],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        barGap: 0,
        label: {
          show: true,
          rotate: 90,
          formatter: '{c}',
          fontSize: 12,
          rich: {
            name: {}
          },
          textBorderColor: '#000',
          textBorderWidth: 3,
          color: '#fff'
        },
        itemStyle: {
          color: '#ee6666',
        },
        emphasis: {
          focus: 'series'
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
      // axisLabel: {
      //   formatter: '{value} ราย'
      // }
    },
    series: [
      {
        name: 'A',
        data: [dashboard?.Daysofweek?.Monday[0], dashboard?.Daysofweek?.Tuesday[0], dashboard?.Daysofweek?.Wednesday[0], dashboard?.Daysofweek?.Thursday[0], dashboard?.Daysofweek?.friday[0]],
        type: 'bar',
        showBackground: false,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        itemStyle: {
          color: '#5470c6',
        },
      },
      {
        name: 'B',
        data: [dashboard?.Daysofweek?.Monday[1], dashboard?.Daysofweek?.Tuesday[1], dashboard?.Daysofweek?.Wednesday[1], dashboard?.Daysofweek?.Thursday[1], dashboard?.Daysofweek?.friday[1]],
        type: 'bar',
        showBackground: false,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        itemStyle: {
          color: '#ee6666',
        },
      },
      {
        name: 'C',
        data: [dashboard?.Daysofweek?.Monday[2], dashboard?.Daysofweek?.Tuesday[2], dashboard?.Daysofweek?.Wednesday[2], dashboard?.Daysofweek?.Thursday[2], dashboard?.Daysofweek?.friday[2]],
        type: 'bar',
        showBackground: false,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        itemStyle: {
          color: '#91cc75',
        },
      },
      {
        name: 'D',
        data: [dashboard?.Daysofweek?.Monday[3], dashboard?.Daysofweek?.Tuesday[3], dashboard?.Daysofweek?.Wednesday[3], dashboard?.Daysofweek?.Thursday[3], dashboard?.Daysofweek?.friday[3]],
        type: 'bar',
        showBackground: false,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        itemStyle: {
          color: '#fac858',
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
    // toolbox: {
    //   show: true,
    //   orient: 'vertical',
    //   left: 'right',
    //   top: 'center',
    //   feature: {
    //     mark: { show: true },
    //     dataView: { show: true, readOnly: false },
    //     magicType: { show: true, type: ['line', 'bar', 'stack'] },
    //     restore: { show: true },
    //     saveAsImage: { show: true },
    //   },
    // },
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
        // axisLabel: {
        //   formatter: '{value} ราย'
        // }
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
      <div style={{ display: 'none' }} >
        <div ref={printViewRef}>
          <PrintPage />
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
          <button onClick={() => handlePrint()} className='print:hidden'><FaPrint /></button>
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
                <Image src={'http://localhost:3000/images/prescription.png'} width={20} height={20} alt={'ใบสั่งยา'} />
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
                <Image src={'http://localhost:3000/images/screening01.png'} width={20} height={20} alt={'คัดกรอง'} />
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
                <Image src={'http://localhost:3000/images/cabinet.png'} width={20} height={20} alt={'กำลังจัดยา'} />
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
                <Image src={'http://localhost:3000/images/drug_check.png'} width={20} height={20} alt={'กำลังตรวจสอบ'} />
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
                <Image src={'http://localhost:3000/images/call_q.png'} width={20} height={20} alt={'กำลังเรียกคิว'} />
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
                <Image src={'http://localhost:3000/images/logo_udh.png'} width={20} height={20} alt={'จ่ายยาสำเร็จ'} />
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
<PrescriptionPage />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <DrugPage />
        </TabsContent>
        <TabsContent value="user" className="space-y-4">
          <div className="flex-1 space-y-4 p-4">
            <div style={{ display: 'none' }} >
              <div ref={printViewRef}>
                <WorkloadView />
              </div>
            </div>
            <Card className="col-span-4 md:col-span-3">
              <CardHeader>
                <CardTitle> <button onClick={() => handlePrint()}><FaPrint /></button></CardTitle>
              </CardHeader>
              <CardContent>
                <RecentUser data={session} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>


    </div>
  );
}
