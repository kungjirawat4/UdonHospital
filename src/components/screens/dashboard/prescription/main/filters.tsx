import {
  HelpCircle,
  PackagePlus,
  ScrollText,
  Timer,
  XCircle,
  ShoppingBasket,
  ShoppingCart,
  Pill,
  Tablets,
  BellRing,
  BadgeCheck,
  Hospital,
  Building2,
  Building,
  Store,
  Baby,
  PillBottle,
  CircleX
} from 'lucide-react';

export const status_options = [
  {
    value: 'รอคัดกรอง',
    label: 'รอคัดกรอง',
    icon: HelpCircle,
  },
  {
    value: 'รอจับคู่ตะกร้า',
    label: 'รอจับคู่ตะกร้า',
    icon: ShoppingCart,
  },
  {
    value: 'กำลังจัดยา',
    label: 'กำลังจัดยา',
    icon: Pill,
  },
  {
    value: 'กำลังตรวจสอบ',
    label: 'กำลังตรวจสอบ',
    icon: Timer,
  },
  {
    value: 'รอเรียกคิว',
    label: 'รอเรียกคิว',
    icon: BellRing,
  },
  {
    value: 'พักตะกร้า',
    label: 'พักตะกร้า',
    icon: ShoppingBasket,
  },
  {
    value: 'กำลังจ่ายยา',
    label: 'กำลังจ่ายยา',
    icon: Tablets,
  },
  {
    value: 'จ่ายยาสำเร็จ',
    label: 'จ่ายยาสำเร็จ',
    icon: BadgeCheck,
  },
  {
    value: 'ยกเลิก',
    label: 'ยกเลิก',
    icon: CircleX ,
  },
];

export const type_options = [
  {
    value: 'A',
    label: 'A',
    icon: PillBottle,
  },
  {
    value: 'B',
    label: 'B',
    icon: PackagePlus,
  },
  {
    value: 'C',
    label: 'C',
    icon: Baby,
  },
  {
    value: 'D',
    label: 'D',
    icon: ScrollText,
  },
];

export const delivery_options = [
  {
    value: 'โรงพยาบาล',
    label: 'โรงพยาบาล',
    icon: Hospital,
  },
  {
    value: 'เซ็ลทัลพาซ่าอุดรธานี',
    label: 'เซ็ลทัลพาซ่าอุดรธานี',
    icon: Building2,
  },
  {
    value: 'Telemed',
    label: 'Telemed',
    icon: Building,
  },
  {
    value: 'ร้านขายยา',
    label: 'ร้านขายยา',
    icon: Store,
  },
];
