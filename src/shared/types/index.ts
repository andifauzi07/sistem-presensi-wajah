import { Database, TablesInsert, TablesUpdate } from '../../../database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Employee = Tables<'employee'>;
export type EmployeeInsert = TablesInsert<'employee'>;
export type EmployeeUpdate = TablesUpdate<'employee'>;
type EmployeeBasic = {
	id: string;
	nama: string;
};

export type Attendance = Tables<'attendance'>;
export type AttendanceDetail = Attendance & {
	employee: EmployeeBasic;
};

export type AttendanceSubmitResult = {
	type: 'check-in' | 'check-out' | 'already-completed' | 'unknown';
	employee?: Employee;
};

export type Schedule = Tables<'schedule'>;
export type ScheduleInsert = TablesInsert<'schedule'>;
export type ScheduleUpdate = TablesUpdate<'schedule'>;

export type Shift = Tables<'shift'>;
export type ShiftType = Database['public']['Enums']['shift_type'];
