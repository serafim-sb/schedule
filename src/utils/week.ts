

const REFERENCE_MONDAY = new Date(2026, 8, 1); 

export function getMondayOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day; 
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getWeekParity(date: Date): 1 | 2 {
  const targetMonday = getMondayOfWeek(date);
  const referenceMonday = getMondayOfWeek(REFERENCE_MONDAY);

  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  const diffWeeks = Math.round(
    (targetMonday.getTime() - referenceMonday.getTime()) / msInWeek
  );

  return diffWeeks % 2 === 0 ? 1 : 2;
}
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
export function getISODay(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function isLessonNow(startTime: string, endTime: string): boolean{
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  return nowMinutes >= start && nowMinutes < end;
}

