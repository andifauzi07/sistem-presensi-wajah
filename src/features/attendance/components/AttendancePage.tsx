import React from 'react';
import { Camera } from './Camera';
import { useAttendance } from '../attendance.hooks';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export const AttendancePage: React.FC = () => {
	const { data: attendance, isLoading: isAttendanceLoading, mutate, isPending } = useAttendance();

	const handleCapture = (descriptor: number[]) => {
		mutate(descriptor);
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
