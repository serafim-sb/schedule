export type WeekParity = 1 | 2 | "both";

export interface Lesson {
    id: string;
    dayOfWeek: number;
    weekParity: WeekParity;
    startTime: string;
    endTime: string;
    subject: string;
    room: string;
}