import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getEmployeesForRecognition, submitAttendanceByDescriptor } from './attendance.service';

export const useAttendance = () => {
	const queryClient = useQueryClient();

	const employeesQuery = useQuery({
		queryKey: ['employees-for-face-recognition'],
		queryFn: getEmployeesForRecognition,
		staleTime: 0,
	});

	const mutation = useMutation({
		mutationFn: (descriptor: number[]) => submitAttendanceByDescriptor(descriptor),
		onSuccess: (result) => {
			// Dashboard perlu refresh saat check-in/out berhasil ditulis.
			if (result.type === 'check-in' || result.type === 'check-out') {
				queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
			}

			switch (result.type) {
				case 'check-in':
					toast.success(`Check-in berhasil untuk ${result.employee?.nama ?? 'karyawan'}`);
					break;
				case 'check-out':
					toast.success(`Check-out berhasil untuk ${result.employee?.nama ?? 'karyawan'}`);
					break;
				case 'already-completed':
					toast.error(`Presensi hari ini sudah terverifikasi`);
					break;
				case 'unknown':
					toast.error('Wajah tidak dikenali');
					break;
			}
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Gagal memverifikasi kehadiran');
		},
	});

	return {
		mutate: mutation.mutate,
		isPending: mutation.isPending || employeesQuery.isLoading,
	};
};
