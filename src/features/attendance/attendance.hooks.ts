import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getEmployeesAttendance, submitAttendanceByDescriptor } from './attendance.service';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const formatTime = (time: string | null) => time?.split(':').slice(0, 2).join(':') || '--:--';

export const useAttendance = () => {
	const queryClient = useQueryClient();

	const attendance = useQuery({
		queryKey: ['attendance'],
		queryFn: getEmployeesAttendance,
		staleTime: 0,
	});

	useEffect(() => {
		const channel = supabase
			.channel('schema-db-changes')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
				queryClient.invalidateQueries({ queryKey: ['attendance'] });
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);

	const mutation = useMutation({
		mutationFn: (descriptor: number[]) => submitAttendanceByDescriptor(descriptor),
		onSuccess: async (result) => {
			await queryClient.refetchQueries({
				queryKey: ['dashboard'],
				exact: true,
			});

			switch (result.type) {
				case 'check-in-success':
					toast.success(`Halo ${result.employee?.nama}, Check-in berhasil. Selamat bekerja!`);
					break;

				case 'check-out-success':
					toast.success(`Terima kasih ${result.employee?.nama}, Check-out berhasil. Hati-hati di jalan!`);
					break;

				case 'already-completed':
					toast.info(`Presensi Anda untuk hari ini sudah selesai dan terverifikasi.`);
					break;

				case 'unknown':
					toast.error('Wajah tidak dikenali. Pastikan pencahayaan cukup dan wajah terlihat jelas.');
					break;

				case 'too-early-to-checkin':
					toast.warning(`Sabar, ${result.employee?.nama}. Belum waktunya Check-in untuk shift ${result.schedule?.shift?.name || ''}.`);
					break;

				case 'too-early-to-checkout':
					toast.warning(`Maaf ${result.employee?.nama}, Anda belum bisa Check-out sebelum jam kerja berakhir.`);
					break;

				case 'checkin-period-expired':
					toast.error(`Maaf ${result.employee?.nama}, batas waktu Check-in sudah lewat. ` + `Shift ${result.schedule?.shift?.name} dimulai pukul ${formatTime(result.schedule?.shift?.checkin_time)}. ` + `Silakan hubungi HRD.`);
					break;

				case 'no-schedule':
					toast.error(`Hai ${result.employee?.nama}, jadwal Anda tidak ditemukan untuk hari ini. Silakan hubungi Admin.`);
					break;

				default:
					toast.error('Terjadi kesalahan sistem. Silakan coba lagi.');
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
