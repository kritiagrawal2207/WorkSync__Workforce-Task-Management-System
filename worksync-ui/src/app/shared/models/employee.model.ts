export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: Department;
  isActive?: boolean;
}