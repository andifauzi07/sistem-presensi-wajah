import { useState } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, parseISO, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useSchedule, useShiftSchedules } from '../schedule.hooks';
import { useEmployees } from '@/features/employee/employee.hooks';
import { ScheduleUpdateDetails, Shift } from '@/shared/types';
import { id } from 'date-fns/locale';

export function ScheduleTable() {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [editingSchedule, setEditingSchedule] = useState<ScheduleUpdateDetails | null>(null);
	const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
	const { schedules, update: updateSchedule, schedulesLoading } = useSchedule();
	const { data: employees } = useEmployees();
	const { data: shifts } = useShiftSchedules();

	const startDate = startOfMonth(currentMonth);
	const endDate = endOfMonth(currentMonth);
	const days = eachDayOfInterval({ start: startDate, end: endDate });

	const getShiftForEmployeeAndDate = (employeeId: string, date: Date) => {
		return schedules?.find((s) => s.employee.id === employeeId && isSameDay(parseISO(s.date), date));
	};

	const getShiftColor = (shiftName: string | null) => {
		switch (shiftName) {
			case 'Pagi':
				return 'bg-blue-100 text-blue-700 border-blue-200';
			case 'Sore':
				return 'bg-orange-100 text-orange-700 border-orange-200';
			case 'Malam':
				return 'bg-purple-100 text-purple-700 border-purple-200';
			case 'Libur':
				return 'bg-gray-100 text-gray-500 border-gray-200';
			default:
				return 'bg-slate-100 text-slate-700';
		}
	};

	const handleEdit = (schedule: ScheduleUpdateDetails) => {
		setEditingSchedule(schedule);
		setSelectedShift(schedule?.shift as Shift);
	};

	const handleSaveOverride = () => {
		if (editingSchedule && selectedShift) {
			updateSchedule.mutate({ id: editingSchedule.id!, shiftId: selectedShift.id });
		}

		console.log(updateSchedule.isSuccess);

		if (updateSchedule.isSuccess === true) {
			setEditingSchedule(null);
			setSelectedShift(null);
		}
	};

	const nextMonth = () => setCurrentMonth(addDays(endDate, 1));
	const prevMonth = () => setCurrentMonth(addDays(startDate, -1));

	if (schedulesLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={prevMonth}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={nextMonth}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50">
							<TableHead className="sticky left-0 bg-muted/50 z-10 w-50 border-r">Pegawai</TableHead>
							{days.map((day) => (
								<TableHead
									key={day.toString()}
									className="text-center min-w-25">
									<div className="text-[10px] uppercase text-muted-foreground">{format(day, 'EEE', { locale: id })}</div>
									<div className="text-sm font-bold">{format(day, 'd')}</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{employees?.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell className="sticky left-0 bg-background z-10 font-medium border-r">
									<div className="flex flex-col">
										<span>{employee.nama}</span>
										<span className="text-[10px] text-muted-foreground">{employee.jabatan}</span>
									</div>
								</TableCell>
								{days.map((day) => {
									const schedule = getShiftForEmployeeAndDate(employee.id, day);
									return (
										<TableCell
											key={day.toString()}
											className={cn('text-center p-2 transition-colors cursor-pointer hover:bg-muted/50', !schedule && 'bg-muted/20')}
											onClick={() => schedule && handleEdit(schedule as unknown as ScheduleUpdateDetails)}>
											{schedule ? (
												<Badge
													variant="outline"
													className={cn('text-[10px] px-1.5 py-0', getShiftColor(schedule.shift.name))}>
													{schedule.shift.name}
												</Badge>
											) : (
												<span className="text-muted-foreground text-[10px]">-</span>
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={!!editingSchedule}
				onOpenChange={(open) => !open && setEditingSchedule(null)}>
				<DialogContent className="sm:max-w-100">
					<DialogHeader>
						<DialogTitle>Ubah Jadwal</DialogTitle>
					</DialogHeader>
					{editingSchedule && (
						<div className="space-y-4 py-4">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Pegawai</p>
								<p className="text-base font-semibold">{editingSchedule.employee.nama}</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Tanggal</p>
								<p className="text-base font-semibold">{format(parseISO(editingSchedule?.date || ''), 'PPPP', { locale: id })}</p>
							</div>
							<div className="space-y-2">
								<Label>Shift</Label>
								<Select
									onValueChange={(value) => {
										const found = shifts?.find((s) => s.id === value);
										setSelectedShift(found || null);
									}}>
									<SelectTrigger>
										<SelectValue placeholder="Pilih shift">{selectedShift?.name}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{shifts?.map((shift) => (
											<SelectItem
												key={shift.id}
												value={shift.id}>
												{shift.name} ({shift.checkin_time || 'LIBUR'})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditingSchedule(null)}>
							Batal
						</Button>
						<Button
							onClick={handleSaveOverride}
							disabled={updateSchedule.isPending}>
							{updateSchedule.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Perubahan'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
