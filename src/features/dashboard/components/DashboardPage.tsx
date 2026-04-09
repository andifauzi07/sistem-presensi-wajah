import React from 'react';
import { useDashboard, useReportAttendance } from '@/features/dashboard/dashboard.hooks';
import { useEmployees } from '@/features/employee/employee.hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmployeeList } from '../../employee/components/EmployeeList';
import { EmployeeForm } from '../../employee/components/EmployeeForm';

import { generateAttendanceReport, getStatus } from '../dashboard.utils';
import { Users, UserCheck, FileText, LogOut, Activity, Loader2, Clock, Plus, Calendar1 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/features/auth/auth.hooks';
import { ScheduleTable } from '@/features/schedule/components/ScheduleList';
import { ScheduleForm } from '@/features/schedule/components/ScheduleForm';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export const DashboardPage: React.FC = () => {
	const { data: todayAttendance, isLoading: loadingAttendance } = useDashboard();
	const { data: stats } = useReportAttendance();
	const { data: employees, isLoading: loadingEmployee } = useEmployees();
	const { data } = useSession();

	const logout = async () => {
		await supabase.auth.signOut();
	};

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			{/* Navbar */}
			<header className="bg-white border-b border-slate-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="bg-transparent p-1.5 rounded-lg">
							<img
								src="/image.png"
								alt="RSUD La Mappapenning"
								className="h-10 w-10"
							/>
						</div>
						<span className="font-bold text-xl tracking-tight text-slate-900">RSUD La Mappapenning</span>
					</div>

					<div className="flex items-center gap-4">
						<div className="text-right hidden sm:block">
							<p className="text-sm font-medium text-slate-900">{data?.user?.email}</p>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={logout}
							className="text-slate-500 hover:text-red-600 hover:bg-red-50">
							<LogOut className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</header>

			<main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					<Card className="border-none shadow-sm hover:shadow-md transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium text-slate-500">Total Pegawai</CardTitle>
							<Users className="h-4 w-4 text-slate-400" />
						</CardHeader>
						<CardContent>{loadingEmployee ? <Loader2 className="h-8 w-8 animate-spin text-slate-200" /> : <div className="text-3xl font-bold text-slate-900">{employees?.length}</div>}</CardContent>
					</Card>

					<Card className="border-none shadow-sm hover:shadow-md transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium text-slate-500">Hadir Hari Ini</CardTitle>
							<UserCheck className="h-4 w-4 text-green-500" />
						</CardHeader>
						<CardContent>{loadingAttendance ? <Loader2 className="h-8 w-8 animate-spin text-slate-200" /> : <div className="text-3xl font-bold text-slate-900">{todayAttendance?.length || 0}</div>}</CardContent>
					</Card>

					<Card className="border-none shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium text-slate-500">Pintasan</CardTitle>
							<Activity className="h-4 w-4 text-blue-500" />
						</CardHeader>
						<CardContent className="flex gap-2">
							<Button
								// onClick={handleGenerateReport}
								disabled
								variant="outline"
								className="flex-1 border-slate-200 hover:bg-slate-50">
								<FileText className="mr-2 h-4 w-4" />
								Laporan
							</Button>
							<EmployeeForm />
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs
					defaultValue="activity"
					className="space-y-6">
					<div className="flex items-center justify-between">
						<TabsList className="bg-white border border-slate-200 p-1">
							<TabsTrigger
								value="activity"
								className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
								<Clock className="mr-2 h-4 w-4" />
								Aktifitas
							</TabsTrigger>
							<TabsTrigger
								value="employees"
								className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
								<Users className="mr-2 h-4 w-4" />
								Pegawai
							</TabsTrigger>
							<TabsTrigger
								value="schedules"
								className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
								<Calendar1 className="mr-2 h-4 w-4" />
								Jadwal
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent
						value="activity"
						className="space-y-4">
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
											{loadingAttendance ? (
												<TableSkeleton
													rows={3}
													columns={7}
												/>
											) : (
												todayAttendance?.map((log) => (
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
											{todayAttendance?.length === 0 && (
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
					</TabsContent>
					<TabsContent value="employees">
						<Card className="border-none shadow-sm">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle>Pegawai</CardTitle>
									<CardDescription>Kelola pegawai Anda.</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<EmployeeList />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="schedules">
						<Card className="border-none shadow-sm">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle>Jadwal</CardTitle>
									<CardDescription>Kelola Jadwal Pegawai.</CardDescription>
								</div>
								<ScheduleForm />
							</CardHeader>
							<CardContent>
								<ScheduleTable />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};
