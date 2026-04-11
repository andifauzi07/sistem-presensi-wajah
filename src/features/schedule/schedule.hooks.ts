import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSchedules, createSchedule, updateSchedule, getSchedulesByShift, getShifts, deleteSchedule, bulkUpdateSchedule } from './schedule.services';
import { ScheduleInsert, ShiftType } from '@/shared/types';
import { toast } from 'sonner';

export const useSchedule = (shift?: ShiftType) => {
	const queryClient = useQueryClient();

	const schedulesQuery = useQuery({
		queryKey: ['schedule'],
		queryFn: getSchedules,
	});

	const schedulesByShiftQuery = useQuery({
		queryKey: ['schedule', { shift }],
		queryFn: () => getSchedulesByShift(shift!),
		enabled: !!shift,
	});

	const createMutation = useMutation({
		mutationFn: (data: Omit<ScheduleInsert, 'id' | 'created_at'>) => createSchedule(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['schedule'], exact: false });
			toast.success('Berhasil menambahkan jadwal');
		},
		onError: (error: any) => {
			if (error?.code === '23505') {
				toast.error('Pegawai tersebut sudah memiliki jadwal, silahkan ubah atau hapus jadwal lama terlebih dahulu');
			} else {
				toast.error(error || 'Gagal menambahkan jadwal');
			}
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, shiftId }: { id: string; shiftId: string }) => updateSchedule(id, shiftId),
		onSuccess: () => {
			toast.success('Jadwal berhasil diperbarui');
			queryClient.invalidateQueries({ queryKey: ['schedule'] });
		},
		onError: (error: any) => {
			toast.error(error.message || 'Gagal memperbarui jadwal');
		},
	});

	const bulkUpdateMutation = useMutation({
		mutationFn: (data: { employee_ids: string[]; start_date: string; end_date: string }) => bulkUpdateSchedule(data),
		onSuccess: () => {
			toast.success(`Berhasil membuatjadwal`);
			// toast.success(`Berhasil membuat ${data.totalGenerated} jadwal`);
			queryClient.invalidateQueries({ queryKey: ['schedule'] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteSchedule(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['schedule'] });
			toast.success('Jadwal berhasil dihapus');
		},
		onError: (error: any) => {
			console.error('Error deleting schedule:', error);
			toast.error(error.message || 'Gagal Menghapus Jadwal');
		},
	});

	return {
		schedules: schedulesQuery.data,
		deleteMutationSchedule: deleteMutation,
		schedulesLoading: schedulesQuery.isLoading,
		update: updateMutation,
		schedulesByShift: schedulesByShiftQuery.data,
		schedulesByShiftLoading: schedulesByShiftQuery.isLoading,
		bulkUpdate: bulkUpdateMutation,
		create: createMutation,
	};
};

export const useShiftSchedules = () => {
	return useQuery({
		queryKey: ['shift'],
		queryFn: () => getShifts(),
	});
};
