import { supabase } from '@/lib/supabase';
import { ScheduleInsert, ShiftType } from '@/shared/types';

export const getSchedules = async () => {
	const { data, error } = await supabase.from('schedule').select(
		`
     	id, 
      employee (
        id,
        nama,
				jabatan
      ),
			shift (
				name,
				checkin_time,
				checkout_time,
				overdue
			)
    `,
	);

	if (error) throw error;

	return data;
};

export const getSchedulesByShift = async (shiftType: ShiftType) => {
	const { data, error } = await supabase
		.from('schedule')
		.select(
			`
			id,
			employee (
        id,
        nama,
				jabatan
      ),
			shift!inner (
				name,
				checkin_time,
				checkout_time,
				overdue
			)
		`,
		)
		.eq('shift.name', shiftType);

	if (error) throw error;

	return data;
};

export const createSchedule = async (schedule: ScheduleInsert) => {
	const { data, error } = await supabase.from('schedule').insert(schedule);

	if (error) throw error;

	return data;
};

export const getShifts = async () => {
	const { data, error } = await supabase.from('shift').select('*');

	if (error) throw error;

	return data;
};
