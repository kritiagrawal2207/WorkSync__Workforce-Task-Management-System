export const API_BASE_URL = 'http://localhost:5180/api';
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`
  },
  employees: {
    root: `${API_BASE_URL}/Employees`,
    byId: (id: number) => `${API_BASE_URL}/Employees/${id}`
  },
  departments: {
    root: `${API_BASE_URL}/departments`
  },
  attendance: {
    root: `${API_BASE_URL}/attendance`,
    byEmployee: (employeeId: number) => `${API_BASE_URL}/attendance/employee/${employeeId}`,
    today: (employeeId: number) => `${API_BASE_URL}/attendance/employee/${employeeId}/today`,
    checkOut: (attendanceId: number) => `${API_BASE_URL}/attendance/${attendanceId}/checkout`
  },
  tasks: {
    root: `${API_BASE_URL}/tasks`,
    byId: (taskId: number) => `${API_BASE_URL}/tasks/${taskId}`,
    byEmployee: (employeeId: number) => `${API_BASE_URL}/tasks/employee/${employeeId}`,
    updateStatus: (taskId: number) => `${API_BASE_URL}/tasks/${taskId}/status`,
    assign: `${API_BASE_URL}/tasks/assign`,
    comment: `${API_BASE_URL}/tasks/comment`
  }
};