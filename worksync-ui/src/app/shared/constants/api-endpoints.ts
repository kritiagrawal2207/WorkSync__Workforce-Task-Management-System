export const API_BASE_URL = 'http://localhost:5180/api';

export const API_ENDPOINTS = {
  employees: `${API_BASE_URL}/employee`,
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