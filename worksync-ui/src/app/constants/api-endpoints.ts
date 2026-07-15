export const API_BASE_URL = 'http://localhost:5180/api';
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`
  },
  employees: {
    root: `${API_BASE_URL}/Employee`,
    byId: (id: number) => `${API_BASE_URL}/Employee/${id}`,
    activate:   (id: number) => `${API_BASE_URL}/Employee/${id}/activate`, 
    deactivate: (id: number) => `${API_BASE_URL}/Employee/${id}/deactivate`
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
    my: `${API_BASE_URL}/tasks/my`,
    byId: (taskId: number) => `${API_BASE_URL}/tasks/${taskId}`,
    byEmployee: (employeeId: number) => `${API_BASE_URL}/tasks/employee/${employeeId}`,
    updateStatus: (taskId: number) => `${API_BASE_URL}/tasks/${taskId}/status`,
    assign: `${API_BASE_URL}/tasks/assign`,
    comment: `${API_BASE_URL}/tasks/comment`
  },
  files: {
    upload:    (taskId: number) => `${API_BASE_URL}/fileupload/task/${taskId}`,        
    list:      (taskId: number) => `${API_BASE_URL}/fileupload/task/${taskId}/files`,   
    delete:    (taskId: number, fileId: number) =>
                 `${API_BASE_URL}/fileupload/task/${taskId}/file/${fileId}`,      
    preview:   (taskId: number, fileName: string) =>
                 `${API_BASE_URL}/fileupload/task/${taskId}/preview/${fileName}`,     
    download:  (taskId: number, fileName: string) =>
                 `${API_BASE_URL}/fileupload/task/${taskId}/download/${fileName}`    
  },
  dashboard: {
    summary: `${API_BASE_URL}/dashboard/summary`
  },
  notifications: {
    byUser:      (userId: number) => `${API_BASE_URL}/notifications/${userId}`,
    unreadCount: (userId: number) => `${API_BASE_URL}/notifications/${userId}/unread-count`,
    create:      `${API_BASE_URL}/notifications`,
    markRead:    (id: number)     => `${API_BASE_URL}/notifications/${id}/read`,
    markAllRead: `${API_BASE_URL}/notifications/read-all`
  }
};