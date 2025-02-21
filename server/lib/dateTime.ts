import dayjs from 'dayjs'

// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'
import buddhistEra from "dayjs/plugin/buddhistEra";
 
dayjs.extend(buddhistEra); // ใช้งาน buddhistEra plugin เพื่อแปลงเป็น พ.ศ.

/* 07 กุมภาพันธ์ 2566 */
export const DateMateTH = (date: Date) => {
    dayjs.locale('th');
    return dayjs(date).format('BBBBMMDD');
  };
  
  /* 07 กุมภาพันธ์ 2566 */
  export const DateLongTH = (date: Date) => {
    dayjs.locale('th');
    return dayjs(date).format('DD MMMM BBBB');
  };
  
  /* 07 ก.พ. 2566 */
  export const DateTimeLongTH = (date: Date) => {
    dayjs.locale('th');
    return dayjs(date).format('DD MMMM BBBB hh:mm');
  };
  
  /* 07 ก.พ. 2566 */
  export const DateShortTH = (date: Date) => {
    dayjs.locale('th');
    return dayjs(date).format('DD MMM BB');
  };
  
  /* 07 ก.พ. 2566 */
  export const DateTimeShortTH = (date: Date) => {
    dayjs.locale('th');
    return dayjs(date).format('DD MMM BB hh:mm');
  };
  
  /* 07 February 2023 */
  export const DateLongEN = (date: Date) => {
    dayjs.locale('en');
    return dayjs(date).format('DD MMMM YYYY');
  };
  
  /* 07 February 2023 */
  export const DateTimeLongEN = (date: Date) => {
    dayjs.locale('en');
    return dayjs(date).format('DD MMMM YYYY hh:mm');
  };
  
  /* 07 Feb 23 */
  export const DateShortEN = (date: Date) => {
    dayjs.locale('en');
    return dayjs(date).format('DD MMM YY');
  };
  
  /* 07 ก.พ. 2566 */
  export const TimeShortTH = (date: Date) => {
    dayjs.locale('th');
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
  };
  
  /* 07 ก.พ. 2566 */
  export const TimeShortEN = (date: Date) => {
    dayjs.locale('en');
    return dayjs(date).format('hh:mm');
  };
  
  export const DateTime = dayjs;
  
  export const THB = (amount: number | any) => {
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

export default DateTime
