import React from 'react';
import { Camera } from './Camera';
import { useAttendance, useGeolocation } from '../attendance.hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { Badge } from '@/components/ui/badge';
import { getStatus } from '@/features/dashboard/dashboard.utils';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';

export const AttendancePage: React.FC = () => {
	const { latitude, longitude, loading: loadingLocation, error: errorLocation } = useGeolocation();
	const { data: attendance, isLoading: isAttendanceLoading, mutate: submitAttendance, isPending } = useAttendance();

	const handleCapture = async (descriptor: number[]) => {
		if (!errorLocation && !loadingLocation) {
			submitAttendance({
				descriptor,
				latitude,
				longitude,
			});
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900">Sistem Presensi Pegawai</h1>
					<p className="text-slate-500">RSUD La Mappapenning</p>
					<img
						src="/image.png"
						alt="RSUD La Mappapenning"
						className="h-20 w-20 bg-transparent mx-auto"
					/>
				</div>

				<Card className="border-none shadow-sm">
					<CardHeader>
						<CardTitle>Aktifitas Hari Ini</CardTitle>
						<CardDescription>Daftar Pegawai yang melakukan presensi.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="border rounded-lg overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="bg-slate-50/50">
										<TableHead>Nama Pegawai</TableHead>
										<TableHead>Jadwal Shift</TableHead>
										<TableHead>Waktu Shift</TableHead>
										<TableHead>Datang</TableHead>
										<TableHead>Pulang</TableHead>
										<TableHead>Keterangan</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isAttendanceLoading ? (
										<TableSkeleton
											rows={3}
											columns={7}
										/>
									) : (
										attendance?.map((log) => (
											<TableRow
												key={log.id}
												className="hover:bg-slate-50/50 transition-colors">
												<TableCell className="font-medium text-slate-900">{log?.employee?.nama}</TableCell>

												<TableCell className="text-slate-500">{`${format(parse(log.schedule?.shift?.checkin_time || '', 'HH:mm:ss', new Date()), 'HH:mm')} - ${format(parse(log.schedule?.shift?.checkout_time || '', 'HH:mm:ss', new Date()), 'HH:mm')}`}</TableCell>
												<TableCell className="text-slate-500">{log.schedule.shift.name}</TableCell>
												<TableCell className="text-slate-500">{log.check_in ? format(new Date(log.check_in), 'HH:mm:ss') : '-'}</TableCell>
												<TableCell className="text-slate-500">{log.check_out ? format(new Date(log.check_out), 'HH:mm:ss') : '-'}</TableCell>

												<TableCell>
													<Badge
														variant={getStatus(log) === 'hadir' ? 'default' : 'secondary'}
														className={getStatus(log) === 'hadir' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-none'}>
														{getStatus(log)}
													</Badge>
												</TableCell>

												<TableCell>
													<div className="flex items-center gap-2">
														<Badge
															variant={log.status === 'Hadir' ? 'outline' : 'destructive'}
															className={cn('text-xs font-medium', log.status === 'Terlambat' ? 'text-red-600' : 'text-slate-400')}>
															<div className={cn('h-2 w-2 rounded-full animate-pulse', log.status === 'Hadir' ? 'bg-green-500' : log.status === 'Terlambat' ? 'bg-red-500' : log.status === 'Izin' ? 'bg-blue-500' : 'bg-slate-300')} />
															{log.status}
														</Badge>
													</div>
												</TableCell>
											</TableRow>
										))
									)}
									{attendance?.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={7}
												className="h-32 text-center text-slate-500">
												Tidak ada aktivitas yang tercatat hari ini.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<Card className="border-none shadow-xl">
					<CardHeader className="text-center">
						<CardTitle>Verifikasi Kehadiran</CardTitle>
						<CardDescription>Posisikan wajah Anda di dalam bingkai kamera dan klik verifikasi.</CardDescription>
					</CardHeader>
					<CardContent>
						<Camera
							onCapture={handleCapture}
							isLoading={isPending}
						/>
					</CardContent>
				</Card>
				<div className="flex justify-center">
					<Link to="/login">
						<Button
							variant="ghost"
							className="text-slate-500">
							<LogIn className="mr-2 h-4 w-4" />
							Admin Login
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};
