import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2, User } from 'lucide-react';
import { useSchedule } from '../schedule.hooks';
import { capitalize } from '@/lib/utils';

export const ScheduleList: React.FC = () => {
	const { schedules, schedulesLoading, schedulesByShift, schedulesByShiftLoading, create } = useSchedule();

	console.log('schedules: ', schedules);
	console.log('schedules by shift: ', schedulesByShift);

	return (
		<div className="border rounded-lg bg-white overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-slate-50/50">
						<TableHead className="w-20">Profile</TableHead>
						<TableHead>Nama</TableHead>
						<TableHead>Jabatan</TableHead>
						<TableHead>Shift</TableHead>
						<TableHead>Masuk</TableHead>
						{/* <TableHead className="text-right">Aksi</TableHead> */}
					</TableRow>
				</TableHeader>
				<TableBody>
					{schedules?.map((schedule) => (
						<TableRow
							key={schedule.id}
							className="hover:bg-slate-50/50 transition-colors">
							<TableCell>
								<Avatar className="h-10 w-10 border-2 border-slate-100">
									<AvatarFallback className="bg-slate-100 text-slate-600">
										<User className="h-5 w-5" />
									</AvatarFallback>
								</Avatar>
							</TableCell>
							<TableCell className="font-medium text-slate-900">{capitalize(schedule.employee.nama)}</TableCell>
							<TableCell className="text-slate-500">{capitalize(schedule.employee?.jabatan)}</TableCell>
							<TableCell className="text-slate-500">{schedule.shift.name}</TableCell>
							<TableCell className="text-slate-500">{schedule.shift.checkin_time}</TableCell>
							{/* <TableCell className="text-right">
								<Button
									variant="ghost"
									size="icon"
									className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
									onClick={() => deleteMutation.mutate(schedule.id)}
									disabled={deleteMutation.isPending}>
									{deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
								</Button>
							</TableCell> */}
						</TableRow>
					))}
					{schedules?.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-32 text-center text-slate-500">
								No schedules registered yet.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};
