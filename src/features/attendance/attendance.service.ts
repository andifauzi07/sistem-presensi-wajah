import { supabase } from '@/lib/supabase';
import { AttendanceDetail, AttendanceInput } from '@/shared/types';

export const submitAttendanceByDescriptor = async (payload: AttendanceInput) => {
	const { data, error } = await supabase.functions.invoke('Create-Attendance', {
		body: {
			descriptor: payload.descriptor,
			latitude: payload.latitude,
			longitude: payload.longitude,
		},
	});

	if (error) throw error;
	return data;
};

export const getEmployeesAttendance = async () => {
	const today = new Date().toISOString().split('T')[0];

	const { data, error } = await supabase
		.from('attendance')
		.select(
			`
			id,
			employee (
        nama,
				jabatan
      ),
			check_in,
			check_out,
			schedule(
				shift (name, checkin_time, checkout_time, overdue)
			),
			status,
			check_in
		`,
		)
		.eq('date', today)
		.limit(5);

	if (error) throw error;

	return data as unknown as AttendanceDetail[];
};
