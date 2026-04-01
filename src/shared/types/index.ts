import { Database } from '../../../database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Employee = Tables<'employee'>;
export type Attendance = Tables<'attendance'>;

export type AttendanceSubmitResult = {
	type: 'check-in' | 'check-out' | 'already-completed' | 'unknown';
	employee?: Employee;
};
