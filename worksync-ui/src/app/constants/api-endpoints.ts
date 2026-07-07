export const API_BASE_URL = 'http://localhost:5180/api';

export const API_ENDPOINTS = {
  employees: `${API_BASE_URL}/Employees`,
  attendance: {
    root: `${API_BASE_URL}/attendance`,
    byEmployee: (employeeId: number) => `${API_BASE_URL}/attendance/employee/${employeeId}`,
    today: (employeeId: number) => `${API_BASE_URL}/attendance/employee/${employeeId}/today`,
    checkOut: (attendanceId: number) => `${API_BASE_URL}/attendance/${attendanceId}/checkout`
  },
  tasks: {
    root: `${API_BASE_URL}/tasks`,
    byId: (taskId: number) => `${API_BASE_URL}/tasks/${taskId}`,
    my: `${API_BASE_URL}/tasks/my`,
    byEmployee: (employeeId: number) => `${API_BASE_URL}/tasks/employee/${employeeId}`,
    updateStatus: (taskId: number) => `${API_BASE_URL}/tasks/${taskId}/status`,
    assign: `${API_BASE_URL}/tasks/assign`,
    comment: `${API_BASE_URL}/tasks/comment`
     dashboard: {
    summary: `${API_BASE_URL}/dashboard/summary`,
  },
  notifications: {
    byUser:      (userId: number) => `${API_BASE_URL}/notifications/${userId}`,
    unreadCount: (userId: number) => `${API_BASE_URL}/notifications/${userId}/unread-count`,
    create:      `${API_BASE_URL}/notifications`,
    markRead:    (id: number)     => `${API_BASE_URL}/notifications/${id}/read`,
    markAllRead: `${API_BASE_URL}/notifications/read-all`,
  },
  }
};