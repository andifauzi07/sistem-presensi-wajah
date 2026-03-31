export interface Employee {
  id: string;
  name: string;
  email: string;
  faceDescriptor: number[]; // Float32Array serialized as number[]
  createdAt: string;
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'check-in' | 'check-out';
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  recentActivity: AttendanceLog[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
