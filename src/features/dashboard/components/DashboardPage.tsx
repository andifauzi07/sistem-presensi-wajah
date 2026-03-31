import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useEmployees } from '../../employee/hooks/useEmployees';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmployeeList } from '../../employee/components/EmployeeList';
import { EmployeeForm } from '../../employee/components/EmployeeForm';
import { useAuthStore } from '../../auth/hooks/useAuth';
import { generateAttendanceReport } from '../utils/reportGenerator';
import { Users, UserCheck, FileText, LogOut, Activity, LayoutDashboard, Loader2, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
	const { data: stats, isLoading: isStatsLoading } = useDashboard();
	const { data: employees } = useEmployees();
	const { logout, user } = useAuthStore();

	const handleGenerateReport = () => {
		if (employees && stats?.recentActivity) {
			generateAttendanceReport(employees, stats.recentActivity, new Date());
		}
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
								alt="RSUD La Mappanenning"
								className="h-10 w-10"
							/>
						</div>
						<span className="font-bold text-xl tracking-tight text-slate-900">RSUD La Mappanenning</span>
					</div>

					<div className="flex items-center gap-4">
						<div className="text-right hidden sm:block">
							<p className="text-sm font-medium text-slate-900">{user?.name}</p>
							<p className="text-xs text-slate-500">{user?.email}</p>
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
							<CardTitle className="text-sm font-medium text-slate-500">Total Employees</CardTitle>
							<Users className="h-4 w-4 text-slate-400" />
						</CardHeader>
						<CardContent>{isStatsLoading ? <Loader2 className="h-8 w-8 animate-spin text-slate-200" /> : <div className="text-3xl font-bold text-slate-900">{stats?.totalEmployees || 0}</div>}</CardContent>
					</Card>

					<Card className="border-none shadow-sm hover:shadow-md transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium text-slate-500">Present Today</CardTitle>
							<UserCheck className="h-4 w-4 text-green-500" />
						</CardHeader>
						<CardContent>{isStatsLoading ? <Loader2 className="h-8 w-8 animate-spin text-slate-200" /> : <div className="text-3xl font-bold text-slate-900">{stats?.presentToday || 0}</div>}</CardContent>
					</Card>

					<Card className="border-none shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium text-slate-500">Quick Actions</CardTitle>
							<Activity className="h-4 w-4 text-blue-500" />
						</CardHeader>
						<CardContent className="flex gap-2">
							<Button
								onClick={handleGenerateReport}
								variant="outline"
								className="flex-1 border-slate-200 hover:bg-slate-50">
								<FileText className="mr-2 h-4 w-4" />
								Report
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
								Real-time Activity
							</TabsTrigger>
							<TabsTrigger
								value="employees"
								className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
								<Users className="mr-2 h-4 w-4" />
								Employee Directory
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent
						value="activity"
						className="space-y-4">
						<Card className="border-none shadow-sm">
							<CardHeader>
								<CardTitle>Recent Attendance Logs</CardTitle>
								<CardDescription>Live updates of employee check-ins and check-outs</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="border rounded-lg overflow-hidden">
									<Table>
										<TableHeader>
											<TableRow className="bg-slate-50/50">
												<TableHead>Employee</TableHead>
												<TableHead>Type</TableHead>
												<TableHead>Time</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{stats?.recentActivity.map((log) => (
												<TableRow
													key={log.id}
													className="hover:bg-slate-50/50 transition-colors">
													<TableCell className="font-medium text-slate-900">{log.employeeName}</TableCell>
													<TableCell>
														<Badge
															variant={log.type === 'check-in' ? 'default' : 'secondary'}
															className={log.type === 'check-in' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-none'}>
															{log.type.toUpperCase()}
														</Badge>
													</TableCell>
													<TableCell className="text-slate-500">{format(new Date(log.timestamp), 'HH:mm:ss')}</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
															<span className="text-xs text-slate-400">Verified</span>
														</div>
													</TableCell>
												</TableRow>
											))}
											{(!stats?.recentActivity || stats.recentActivity.length === 0) && (
												<TableRow>
													<TableCell
														colSpan={4}
														className="h-32 text-center text-slate-500">
														No activity recorded today.
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
									<CardTitle>Employee Directory</CardTitle>
									<CardDescription>Manage your organization's employees and their face profiles</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<EmployeeList />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};
