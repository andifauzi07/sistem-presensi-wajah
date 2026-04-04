import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSchedules, createSchedule, getSchedulesByShift, getShifts, deleteSchedule } from './schedule.services';
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

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteSchedule(id),
		onSuccess: () => {
			console.log('Schedule deleted successfully');
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

		schedulesByShift: schedulesByShiftQuery.data,
		schedulesByShiftLoading: schedulesByShiftQuery.isLoading,

		create: createMutation,
	};
};

export const useShiftSchedules = () => {
	return useQuery({
		queryKey: ['shift'],
		queryFn: () => getShifts(),
	});
};
