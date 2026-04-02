import { Database, TablesInsert, TablesUpdate } from '../../../database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Employee = Tables<'employee'>;
export type EmployeeInsert = TablesInsert<'employee'>;
export type EmployeeUpdate = TablesUpdate<'employee'>;

export type Attendance = Tables<'attendance'>;

export type AttendanceSubmitResult = {
	type: 'check-in' | 'check-out' | 'already-completed' | 'unknown';
	employee?: Employee;
};
