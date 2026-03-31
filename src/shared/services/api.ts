import { AttendanceLog, DashboardStats, Employee } from "../types";

// Mock data
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', faceDescriptor: [], createdAt: new Date().toISOString() },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', faceDescriptor: [], createdAt: new Date().toISOString() },
];

const MOCK_LOGS: AttendanceLog[] = [
  { id: '1', employeeId: '1', employeeName: 'John Doe', type: 'check-in', timestamp: new Date().toISOString() },
];

export const apiService = {
  auth: {
    login: async (email: string, password: string) => {
      await new Promise(r => setTimeout(r, 1000));
      if (email === 'admin@example.com' && password === 'admin123') {
        return { token: 'mock-jwt-token', user: { id: 'admin', email, name: 'Admin User' } };
      }
      throw new Error('Invalid credentials');
    }
  },
  employees: {
    getAll: async (): Promise<Employee[]> => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_EMPLOYEES;
    },
    create: async (data: Omit<Employee, 'id' | 'createdAt'>): Promise<Employee> => {
      await new Promise(r => setTimeout(r, 1000));
      return { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    },
    delete: async (id: string) => {
      await new Promise(r => setTimeout(r, 500));
      return { success: true };
    }
  },
  attendance: {
    submit: async (descriptor: number[]): Promise<{ type: 'check-in' | 'check-out' | 'already-completed' | 'unknown', employee?: Employee }> => {
      await new Promise(r => setTimeout(r, 1500));
      // In real app, backend matches descriptor
      // For mock, we'll just return success for John Doe
      return { type: 'check-in', employee: MOCK_EMPLOYEES[0] };
    },
    getLogs: async (): Promise<AttendanceLog[]> => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_LOGS;
    }
  },
  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      await new Promise(r => setTimeout(r, 500));
      return {
        totalEmployees: MOCK_EMPLOYEES.length,
        presentToday: 1,
        recentActivity: MOCK_LOGS
      };
    }
  }
};
