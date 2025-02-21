/* eslint-disable react/no-array-index-key */

'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Image,
  Radio,
  RadioGroup,
  Spinner,
  Switch,
} from '@nextui-org/react';
import axios from 'axios';
import Link from 'next/link';
// import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useToasts from '@/hooks/use-toasts';
import { toast } from "react-toastify";
// import useApi from '@/hooks/useApi';
import { DateTimeLongTH } from '@/libs/dateTime';

import ConfrimAll from './[slug]/_components/confrimall';
import Autoprint from './[slug]/_components/printpage';
import ApiCall from '@/services/api';
// import { useToast } from '@/components/ui/use-toast'
// import { ToastAction } from '@/components/ui/toast'
// import { Button } from '@/components/ui/button';
const Sidebar = () => {
  const [patient, setPatient] = useState<any[]>([]);
  const [selectedQueueType, setSelectedQueueType] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState(true);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [isAutoPrintEnabled, setIsAutoPrintEnabled] = useState<boolean>(true);
  const [datap, setDatap] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  // const pathname = usePathname();
  const { toastSuccess, toastError } = useToasts();
  // const { toast } = useToast();
  const getApi = ApiCall({
    key: ['prescription'],
    method: 'GET',
    url: `medicine/prescription/station/${selectedQueueType}`,
  })?.get;
  const getApimessage = ApiCall({
    key: ['stationmessage'],
    method: 'GET',
    url: `medicine/prescription/stationmessage/${selectedQueueType}`,
  })?.get;
  const updateApi = ApiCall({
    key: ['arranged'],
    method: 'PUT',
    url: `medicine/prescription/arranged`,
  })?.put;

  useEffect(() => {
    if (selectedQueueType) {
      getApi?.refetch();
    }
  }, [getApi, selectedQueueType]);

  useEffect(() => {
    const data = getApi?.data?.data;
    const detail = getApi?.data?.detail;
    const savedQueueType = localStorage.getItem('selectedQueueType');
    const savedAutoPrintStatus = localStorage.getItem('isAutoPrintEnabled');

    if (savedQueueType) {
      setSelectedQueueType(savedQueueType);
      setIsInvalid(false);
    }
    if (savedAutoPrintStatus !== null) {
      setIsAutoPrintEnabled(JSON.parse(savedAutoPrintStatus));
    }

    if (data && detail) {
      const filteredDetails = detail.filter((item: { print_status: number }) => item.print_status === 0);

      // ใช้ Map เพื่อจัดกลุ่ม filteredDetails ตาม prescripId
      const detailMap = new Map();
      filteredDetails.forEach((detailItem: { prescripId: any }) => {
        if (!detailMap.has(detailItem.prescripId)) {
          detailMap.set(detailItem.prescripId, []);
        }
        detailMap.get(detailItem.prescripId).push(detailItem);
      });

      // ใช้ Map นี้เพื่อจับคู่ข้อมูล
      const matchedSets = data.reduce((result: { data: any; details: any }[], item: { id: any }) => {
        if (detailMap.has(item.id)) {
          result.push({
            data: item,
            details: detailMap.get(item.id),
          });
        }
        return result;
      }, []);
      setCombinedData(matchedSets);
      // setDetail(matchedSets1[0]?.details || []);
      setData(matchedSets[0]?.details || []);
      setDatap(matchedSets[0]?.data || null);

      setPatient(data);
    }
  }, [getApi?.data]);

  useEffect(() => {
    const interval = setInterval(() => {
      getApi?.refetch();
      getApimessage?.refetch();
    }, 10000); // ตั้งเวลาให้เช็คทุก 10 วินาที



    // ทำการล้าง interval เมื่อคอมโพเนนต์จะถูกลบออกหรือเมื่อ getApi หรือข้อมูลมีการเปลี่ยนแปลง
    return () => clearInterval(interval);
  }, [getApi, getApimessage]);

  const updateData = (id: string) => {
    // ทำการอัพเดทข้อมูลโดยใช้ ID ที่ได้รับ
    // console.log("กำลังอัพเดทข้อมูลของยา ID:", id);
    try {
      updateApi?.mutateAsync({ id, medicineAdviceEn: '1' });
      toastSuccess('แก้ไขยาสำเร็จ')
    } catch (error) {
      toastError('เกิดข้อผิดพลาด')
    }
  };

  useEffect(() => {
    toast.dismiss();
    if (getApimessage?.data?.data?.length > 0) {
      getApimessage?.data?.detail.forEach((item) => {
        const toastId = toast(
          <div>
            <p>ยา {item.medicine_name} <br />
              จำนวน {item.medicine_amount}{' '}{item.medicinePackageSize}
              {' '}
              {item.error00}
              {item.error01}
              {item.error02}
              {item.error03}
              {item.error04}
              {item.error05}
              {item.error06}
              {item.error07}
              {item.error08}
              {item.error09}

              <br />
              {item.error10}
            </p>
            <Button variant="ghost"
              onClick={() => {
                // console.log(item.id);
                toast.dismiss(toastId); // ปิด Toast เมื่อคลิกปุ่ม
                updateData(item.id);
              }}
              className="text-white"
            >
              ดำเนินการต่อ
            </Button>
          </div>,
          {
            type: "error", // ระบุประเภทของ Toast เป็น error
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored",
          }
        );
      });
    }
  }, [getApimessage?.data]);
  // console.log(getApimessage?.data?.detail);

  const handleQueueTypeChange = (value: string) => {
    setSelectedQueueType(value);
    setIsInvalid(!value);
    localStorage.setItem('selectedQueueType', value);
  };

  const handleSwitchChange = (isSelected: boolean) => {
    setIsAutoPrintEnabled(isSelected);
    localStorage.setItem('isAutoPrintEnabled', JSON.stringify(isSelected));
  };
  const handleFetchAndPost = async (id: string) => {
    try {
      // console.log(id,selectedQueueType);
      await axios
      .get(`http://172.16.2.254:8080/autoload/cabinet/${id}/${selectedQueueType}`)
      // .get(`${process.env.UDH_NODE_API_URL}/autoload/cabinet/${id}/${selectedQueueType}`)
      .then(async (res) => {
        // eslint-disable-next-line no-console
        console.log(res.data);
      });
      // // ดึงข้อมูลจาก API
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/autoload/cabinet/${id}`);
      // // const response = await axios.get(`http://localhost:3000/api/autoload/cabinet/${id}`);
      // const data = response?.data;

      // // console.log('sdadads', data);
      // if (data) {
      //   // ถ้ามีข้อมูล ให้ POST ไปยัง URL
      //   const postResponse = await axios.post(`${process.env.UDH_KEY_API_URL}/Cabinet_Command`, data);
      //   // const postResponse = await axios.post(`http://192.168.3.20:1234/sendCommand/`, data);

      //   // แสดงผลลัพธ์จาก POST request
      //   // eslint-disable-next-line no-console
      //   console.log('POST Response:', postResponse.data);
      // } else {
      //   console.error('No data received from GET request');
      // }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // console.log(patient);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
      <div className="flex justify-center">
        <Switch
          isSelected={isAutoPrintEnabled}
          onValueChange={handleSwitchChange}
        >
          ออโต้ พิมพ์
        </Switch>
      </div>

      <div className="flex justify-center">
        <RadioGroup
          isRequired
          label="เลือกสเตชั่น"
          orientation="horizontal"
          className="items-center"
          isInvalid={isInvalid}
          value={selectedQueueType}
          onValueChange={handleQueueTypeChange}
          // isDisabled={!!selectedQueueType}
        >
          {['A', 'B', 'C', 'D', 'E'].map(value => (
            <Radio key={value} value={value}>{value}</Radio>
          ))}
        </RadioGroup>
      </div>

      {selectedQueueType && patient.length > 0
        ? (
          patient.map((item, index) => (
            <Card shadow="sm" key={index} className="mx-4">
              <Link
                href={`/medicine/station/${item.id}`}
                onClick={() => {
                  handleFetchAndPost(item.id); // เรียกฟังก์ชันเมื่อคลิก
                }}
              >

                <CardHeader className="flex gap-3">
                  <Image
                    isZoomed
                    alt="nextui logo"
                    height={50}
                    radius="sm"
                    src="/avatar.jpg"
                    width={50}
                    className="h-[50px] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="justify-between text-small">
                    <p className="text-medium">
                      {item.full_name}
                      {' '}
                      คิวที่:
                      {' '}
                      <b>
                      {item.queue_type}
                        {item.queue_code}</b>
                      {' '}
                    </p>
                    <p className="text-small text-default-500">
                      HN:
                      {' '}
                      {item.hnCode}
                      {' '}
                      regNo:
                      {' '}
                      {item.prescripCode}
                    </p>
                    <p className="text-small text-default-500">
                        ห้องตรวจ:
                        {' '}
                        {item.dept_name}
                      </p>
                    <Checkbox isSelected={item.urgent}>ด่วน</Checkbox>
                  </div>
                </CardHeader>
                <CardBody>
                  <p>
                    ยืนยันการจัดยา
                    <b>คลิกที่นี้</b>
                  </p>
                </CardBody>
                <CardFooter className="justify-between text-small">
                  วันเวลาลงทะเบียน:
                  {' '}
                  <b>{DateTimeLongTH(item?.createdAt)}</b>
                </CardFooter>

              </Link>
              {/* <div className="justify-between">
                  <ConfrimAll data={item.id} location={selectedQueueType} />
                </div> */}
              {/* <CardFooter className="flex justify-center">
                <ConfrimAll data={item.id} location={selectedQueueType} />
              </CardFooter> */}

            </Card>
          ))
        )
        : (
          selectedQueueType && <Spinner label="รอใบสั่งยา..." color="danger" />
        )}

      {isAutoPrintEnabled && combinedData.length > 0 && <Autoprint data={data} datap={datap} />}
    </div>
  );
};

export default Sidebar;