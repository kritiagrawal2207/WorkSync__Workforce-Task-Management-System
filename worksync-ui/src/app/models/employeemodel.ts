export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  departmentName: string;
  userId?: number; 
}
export interface EmployeeCreateDto {
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
}