import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { useEmployees } from '@/features/employee/employee.hooks';
import { useSchedule } from '../schedule.hooks';
import { Employee } from '@/shared/types';

export function ScheduleForm() {
	const [open, setOpen] = useState(false);
	const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();
	const [searchQuery, setSearchQuery] = useState('');
	const { data: employees } = useEmployees();
	const { bulkUpdate } = useSchedule();

	const filteredEmployees = employees?.filter((employee) => employee.nama.toLowerCase().includes(searchQuery.toLowerCase()) || employee.jabatan?.toLowerCase().includes(searchQuery.toLowerCase()));

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedEmployees(filteredEmployees?.map((e) => e.id) || []);
		} else {
			setSelectedEmployees([]);
		}
	};

	const handleEmployeeToggle = (id: string) => {
		setSelectedEmployees((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	};

	const handleSubmit = () => {
		if (selectedEmployees.length === 0) {
			toast.warning('Silakan pilih pegawai terlebih dahulu');
			return;
		}

		if (!startDate || !endDate) {
			toast.warning('Tanggal mulai dan selesai harus diisi');
			return;
		}

		bulkUpdate.mutate({
			employee_ids: selectedEmployees,
			start_date: format(startDate, 'yyyy-MM-dd'),
			end_date: format(endDate, 'yyyy-MM-dd'),
		});

		if (bulkUpdate.isSuccess) {
			setOpen(false);
			toast.success('Jadwal berhasil dibuat');
			setSelectedEmployees([]);
			setStartDate(undefined);
			setEndDate(undefined);
			// queryClient.invalidateQueries(['schedules']);
		}
	};

	const previewDays = startDate && endDate ? Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 30;

	const totalRecords = selectedEmployees.length * previewDays;

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						variant="default"
						className="bg-primary hover:bg-primary/90">
						Jadwal Massal
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>Buat Jadwal Otomatis</DialogTitle>
					<DialogDescription>Jadwal dibuat dengan 6 hari kerja 4 hari libur.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-medium">Pilih Pegawai</Label>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="select-all"
									onCheckedChange={handleSelectAll}
									checked={selectedEmployees.length === filteredEmployees?.length && filteredEmployees?.length > 0}
								/>
								<Label
									htmlFor="select-all"
									className="text-xs text-muted-foreground cursor-pointer">
									Pilih Semua
								</Label>
							</div>
						</div>

						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Cari pegawai..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="border rounded-md p-2">
							<ScrollArea className="h-37.5 pr-4">
								<div className="space-y-2">
									{filteredEmployees && filteredEmployees.length > 0 ? (
										filteredEmployees?.map((employee) => (
											<div
												key={employee.id}
												className="flex items-center space-x-2 p-1 hover:bg-muted rounded-sm transition-colors">
												<Checkbox
													id={employee.id}
													checked={selectedEmployees.includes(employee.id)}
													onCheckedChange={() => handleEmployeeToggle(employee.id)}
												/>
												<Label
													htmlFor={employee.id}
													className="text-sm font-normal flex-1 cursor-pointer">
													{employee.nama} <span className="text-xs text-muted-foreground ml-1">({employee.jabatan})</span>
												</Label>
											</div>
										))
									) : (
										<div className="text-center py-4 text-sm text-muted-foreground">Pegawai tidak ditemukan</div>
									)}
								</div>
							</ScrollArea>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Tanggal Mulai</Label>
							<Popover>
								<PopoverTrigger
									render={
										<Button
											variant={'outline'}
											className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{startDate ? format(startDate, 'PPP') : <span>Pilih tanggal</span>}
										</Button>
									}
								/>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={startDate}
										onSelect={setStartDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div className="space-y-2">
							<Label>Tanggal Selesai (Opsional)</Label>
							<Popover>
								<PopoverTrigger
									render={
										<Button
											variant={'outline'}
											className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{endDate ? format(endDate, 'PPP') : <span>Default 30 hari</span>}
										</Button>
									}
								/>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={endDate}
										onSelect={setEndDate}
										initialFocus
										disabled={(date) => (startDate ? date < startDate : false)}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					{selectedEmployees.length > 0 && startDate && (
						<div className="bg-muted/50 p-3 rounded-lg border border-dashed border-muted-foreground/30">
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pratinjau</h4>
							<div className="grid grid-cols-3 gap-2 text-sm">
								<div className="flex flex-col">
									<span className="text-muted-foreground text-[10px]">Pegawai</span>
									<span className="font-mono">{selectedEmployees.length}</span>
								</div>
								<div className="flex flex-col">
									<span className="text-muted-foreground text-[10px]">Hari</span>
									<span className="font-mono">{previewDays}</span>
								</div>
								<div className="flex flex-col">
									<span className="text-muted-foreground text-[10px]">Total Data</span>
									<span className="font-bold text-primary">{totalRecords}</span>
								</div>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}>
						Batal
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={bulkUpdate.isPending || !startDate || !endDate || selectedEmployees.length === 0}>
						{bulkUpdate.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Memproses...
							</>
						) : (
							'Buat Jadwal'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
