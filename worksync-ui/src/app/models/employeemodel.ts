export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;          
  departmentId: number;
  departmentName: string;
}
export interface EmployeeCreateDto {
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
}