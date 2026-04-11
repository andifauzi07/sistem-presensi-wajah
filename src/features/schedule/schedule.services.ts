import { supabase } from '@/lib/supabase';
import { ScheduleInsert, ShiftType } from '@/shared/types';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
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

export const updateSchedule = async (scheduleId: string, newShiftId: string) => {
	const { data, error } = await supabase
		.from('schedule')
		.update({ shift_id: newShiftId }) // Data yang ingin diubah
		.eq('id', scheduleId) // Filter berdasarkan ID baris
		.select(); // Mengembalikan data yang baru diupdate (opsional)

	if (error) {
		console.error('Gagal mengubah jadwal:', error.message);
		throw error;
	}

	return data;
};

export const bulkUpdateSchedule = async (bulkData: { employee_ids: string[]; start_date: string; end_date: string }) => {
	console.log('Bulk updating schedules:', bulkData);
	const { data, error } = await supabase.rpc('generate_bulk_schedule', {
		emp_ids: bulkData.employee_ids,
		start_date: bulkData.start_date,
		end_date: bulkData.end_date,
	});

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
