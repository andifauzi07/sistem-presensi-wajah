import { Database, TablesInsert, TablesUpdate } from '../../../database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Employee = Tables<'employee'>;
export type Schedule = Tables<'schedule'>;
export type Shift = Tables<'shift'>;

export type EmployeeInsert = TablesInsert<'employee'>;
export type EmployeeUpdate = TablesUpdate<'employee'>;
type EmployeeBasic = {
	jabatan: string;
	nama: string;
};

export type Attendance = Tables<'attendance'>;
export type AttendanceDetail = Attendance & {
	employee: EmployeeBasic;
	schedule: Schedule & {
		shift: Shift;
	};
};

export type AttendanceSubmitResult = {
	type: 'check-in' | 'check-out' | 'already-completed' | 'unknown';
	employee?: Employee;
};

export type ScheduleInsert = TablesInsert<'schedule'>;
export type ScheduleUpdate = TablesUpdate<'schedule'>;
export type ScheduleUpdateDetails = ScheduleUpdate & {
	employee: EmployeeBasic;
	shift: Shift;
};

export type ShiftType = Database['public']['Enums']['shift_type'];
