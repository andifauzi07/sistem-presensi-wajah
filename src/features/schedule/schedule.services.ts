import { supabase } from '@/lib/supabase';
import { ScheduleInsert, ShiftType } from '@/shared/types';
import { toast } from 'sonner';

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
			),
			date
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

export const deleteSchedule = async (id: string) => {
	const { error } = await supabase.from('schedule').delete().eq('id', id);

	if (error) throw error;
};

export const getShifts = async () => {
	const { data, error } = await supabase.from('shift').select('*');

	if (error) throw error;

	return data;
};
