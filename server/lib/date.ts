import dayjs from "dayjs";

//TS
export function addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}

export function setHoursToDate(date: Date, hours: number): Date {
  return new Date(date.setHours(hours , 0, 0, 0));
}

export function endHoursToDate(date: Date, hours: number): Date {
  return new Date(date.setHours(hours, 59, 59, 999));
}

export const dayjsNow = dayjs();
export const dayjsStartDate = dayjsNow.startOf("day");
export const dayjsEndDate = dayjsNow.endOf("day");