import { supabase } from '@/lib/supabase';
import { Attendance, AttendanceDetail } from '@/shared/types';

export const getAllAttendance = async (): Promise<Attendance[]> => {
	const { data, error } = await supabase.from('attendance').select('*');

	if (error) throw error;

	return data;
};

export const getTodayAttendance = async (): Promise<AttendanceDetail[]> => {
	const today = new Date().toISOString().split('T')[0];

	const { data, error } = await supabase
		.from('attendance')
		.select(
			`
     id, 
      check_in, 
      check_out, 
      date,
      employee (
        id,
        nama
      )
    `,
		)
		.eq('date', today);

	if (error) throw error;
	return data as unknown as AttendanceDetail[];
};
