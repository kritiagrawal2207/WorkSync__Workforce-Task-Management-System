import { Employee } from './employeemodel';
export type AttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'Absent';
export interface Attendance {
  id: number;
  employeeId: number;
  employee?: Employee;
  checkIn: string;
  checkOut?: string | null;
  status: AttendanceStatus | string;
}
export interface AttendanceCreateRequest {
  employeeId: number;
  checkIn: string;
  checkOut?: string | null;
  status: string;
  userId?: number; 
}
export interface AttendanceCheckOutRequest {
  checkOut: string;
  status: string;
  userId?: number;
}