import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSchedules, createSchedule, getSchedulesByShift, getShifts } from './schedule.services';
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
			toast.error(error.message || 'Gagal menambahkan jadwal');
		},
	});

	return {
		schedules: schedulesQuery.data,
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
