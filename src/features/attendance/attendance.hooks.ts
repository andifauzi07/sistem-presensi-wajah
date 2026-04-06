import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getEmployeesAttendance, submitAttendanceByDescriptor } from './attendance.service';

export const useAttendance = () => {
	const queryClient = useQueryClient();

	const attendance = useQuery({
		queryKey: ['attendance'],
		queryFn: getEmployeesAttendance,
		staleTime: 0,
	});

	const mutation = useMutation({
		mutationFn: (descriptor: number[]) => submitAttendanceByDescriptor(descriptor),
		onSuccess: async (result) => {
			await queryClient.refetchQueries({
				queryKey: ['dashboard'],
				exact: true,
			});

			switch (result.type) {
				case 'check-in-success':
					toast.success(`Check-in berhasil untuk ${result.employee?.nama ?? 'karyawan'}`);
					break;
				case 'check-out-success':
					toast.success(`Check-out berhasil untuk ${result.employee?.nama ?? 'karyawan'}`);
					break;
				case 'already-completed':
					toast.error(`Presensi hari ini sudah terverifikasi`);
					break;
				case 'unknown':
					toast.error('Wajah tidak dikenali');
					break;
				case 'too-early-to-checkout':
					toast.error('Belum waktunya untuk check-out');
					break;
				case 'no-schedule':
					toast.error(`Hai ${result.employee?.nama}. Anda belum memiliki jadwal, hubungi admin untuk penjadwalan`);
			}
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Gagal memverifikasi kehadiran');
		},
	});

	return {
		...attendance,
		mutate: mutation.mutate,
		isPending: mutation.isPending || attendance.isLoading,
	};
};
