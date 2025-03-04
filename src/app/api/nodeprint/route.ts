
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CharacterSet, printer as ThermalPrinter, types as PrinterTypes } from 'node-thermal-printer';

// Define the structure of the data
type Item = {
  name: string;
  quantity: number;
  med_details: string;
  packsize: string;
  labelNo: string;
  dispcause: string; /// F
  medsts: string; // 0 ยาใหม่
};

type PrintData = {
  HN: string;
  pname: string;
  q_dep: string;
  doctor: string;
  pay: string;
  lap: string;
  dept: string;
  allergy: string;
  age:string;
  type_q: string;
  item: Item[];
};

// Initialize printer configuration
const PRINTER_CONFIG = {
  type: PrinterTypes.EPSON,
  interface: 'tcp://172.16.2.112:9100',
  width: 50,
  characterSet: CharacterSet.PC437_USA,
  removeSpecialCharacters: false,
  replaceSpecialCharacters: true,
};

// Utility function to format date and time
const getFormattedDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('th-TH');
  const time = now.toLocaleTimeString('th-TH');
  return { date, time };
};

// Helper function to print item details
function printItemDetails(printer: any, items: Item[]) {
  printer.alignLeft();
  const sortedItems = items.sort((a, b) => {
    const aLabel = Number.parseInt(a.labelNo?.split('/')[0] || '0', 10);
    const bLabel = Number.parseInt(b.labelNo?.split('/')[0] || '0', 10);
    return aLabel - bLabel;
  });
  function getMedStatus(medsts: string) {
    switch (medsts) {
      case '0':
        return 'ยาใหม่';
      case '1':
        return 'ลดขนาดยา';
      case '2':
        return 'เพิ่มขนาดยา';
      case '3':
        return 'ปรับเวลาใช้ยา';
      case '9':
        return 'ผู้ป่วยไม่ได้รับยา';
      case '4':
        return 'Offยา';
      default:
        return ''; // ถ้าไม่ตรงกับกรณีใดๆ
    }
  }

  // items.forEach((item, index) => {
  sortedItems.forEach((item) => {
    // const itemNumber = index + 1;
    // printer.println(`${itemNumber}.${item.name}`); // พิมพ์ชื่อยาและจำนวนในบรรทัดเดียวกัน
    // printer.println(`${item.labelNo?.split('/')[0]}.${item.name}${', '}${item.medsts === '0' ? 'ยาใหม่' : item.medsts || ''}${', '}${item?.dispcause || ''}`); // พิมพ์ชื่อยาและจำนวนในบรรทัดเดียวกัน
    printer.println(`${item.labelNo?.split('/')[0]}.${item.name}${', '}${getMedStatus(item.medsts) || ''}${', '}${item?.dispcause || ''}`);
    printer.println(`** ${item.quantity} ${item.packsize} *** ${item.med_details?.split('#')[0]}`); // พิมพ์ชื่อยาและจำนวนในบรรทัดเดียวกัน
    printer.println('');
    // พิมพ์รายละเอียดยา
    // พิมพ์รายละเอียดยา
    // if (item.med_details) {
    //   printer.println(item.med_details.trim());
    // }
  });
  printer.alignRight();
  printer.println(`รวมทั้งหมด ${items.length} รายการ`);
}

// Template for printing
function printTemplate(printer: any, data: PrintData) {
  const { date, time } = getFormattedDateTime();

  printer.alignCenter();
  // printer.printQR(data.HN);
  printer.printQR(data.HN, {
    cellSize: 6, // 1 - 8
    correction: 'M', // L(7%), M(15%), Q(25%), H(30%)
    model: 2, // 1 - Model 1
    // 2 - Model 2 (standard)
    // 3 - Micro QR
  });

  printer.setTextSize(2, 2);
  printer.bold(true); // ใช้ข้อความหนา
  printer.println(`คิวรับยา : ${data.type_q}${data.q_dep}`);
  printer.setTextQuadArea();
  printer.bold(true);
  printer.println(`HN : ${data.HN}`);
  printer.bold(false);
  printer.println(`ชื่อ: ${data.pname}`);

  printer.setTextNormal();
  printer.println('*'.repeat(48));
  printer.bold(true);
  printer.println(`สิทธิ์ : ${data.pay}`);
  printer.bold(false);
  printer.println('*'.repeat(48));

  printer.bold(true);
  printer.println('รายการยา');
  printer.bold(false);

  printItemDetails(printer, data.item);

  printer.alignLeft();
  printer.println('');
  printer.println(`อายุ:${data.age || ''}`);
  printer.println(`ห้องตรวจ:${data.dept || ''}`);
  printer.println(`ประวัติการแพ้ยา:${data.allergy || ''}`);
  printer.println(`ชื่อแพทย์/ผู้สั่งจ่าย:${data.doctor.trim()}`);
  printer.println(`โรงพยาบาลศูนย์อุดรธานี`);
  printer.println(`วันที่: ${date} ${time}`);

  printer.println('');
  printer.println(`เภสัชผู้ตรวจสอบ:....................`);
  printer.println('');
  printer.println(`เภสัชผู้ส่งมอบ:.....................`);
  printer.alignCenter();
  printer.println('');
  printer.code128(data.HN, {
    width: 'MEDIUM', // "SMALL", "MEDIUM", "LARGE",
    height: 50, // 50 < x < 80
    text: 2, // 1 - No text
    // 2 - Text on bottom
    // 3 - No text inline
    // 4 - Text on bottom inline
  });
  printer.beep();
  printer.cut();
}
async function executePrintJob(data: PrintData) {
  try {
    // สร้าง Printer ใหม่ในแต่ละครั้ง
    const printer = new ThermalPrinter(PRINTER_CONFIG);

    // ตรวจสอบว่าเครื่องพิมพ์เชื่อมต่อหรือไม่
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error('Printer is not connected.');
    }

    // พิมพ์ข้อมูล
    printTemplate(printer, data);
    await printer.execute();

    // ตรวจสอบการพิมพ์สำเร็จ
    return { success: true, message: 'Print job completed!' };
  } catch (error) {
    // ถ้าเกิดข้อผิดพลาดในการพิมพ์
    console.error('Print error:', error);
    return { success: false, message: `Failed to print` };
  }
}

// POST method for handling print requests
export async function POST(req: NextRequest) {
  try {
    const data: PrintData = await req.json();

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!data || !Array.isArray(data.item) || data.item.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid data provided.' }, { status: 400 });
    }

    // เรียกใช้การพิมพ์
    const result = await executePrintJob(data);

    // ส่งผลลัพธ์กลับไป
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
  }
}
