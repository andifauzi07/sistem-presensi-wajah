import React, { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2, ClipboardClock } from 'lucide-react';
import { useSchedule, useShiftSchedules } from '../schedule.hooks';
import { toast } from 'sonner';
import { Field, FieldLabel } from '@/components/ui/field';
import { useEmployees } from '@/features/employee/employee.hooks';
import { Employee, Shift } from '@/shared/types';

export const ScheduleForm: React.FC = () => {
	const { create } = useSchedule();
	const { data: shifts } = useShiftSchedules();
	const { data: employees } = useEmployees();
	const [isOpen, setIsOpen] = useState(false);

	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedEmployee) {
			toast.error('Wajib menambahkan pegawai');
			return;
		}

		if (!selectedShift) {
			toast.error('Shift harus dipilih');
			return;
		}

		await create.mutateAsync({
			employee_id: selectedEmployee.id,
			shift_id: selectedShift.id,
		});

		resetForm();
		setIsOpen(false);
	};

	const resetForm = () => {
		setSelectedEmployee(null);
		setSelectedShift(null);
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DialogTrigger
				render={
					<Button
						variant="default"
						className="bg-green-300 hover:bg-green-200 text-black">
						<Plus className="mr-2 h-4 w-4" />
						Atur Jadwal
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-lg ">
				<DialogHeader>
					<DialogTitle>Tambahkan Jadwal Karyawan</DialogTitle>
				</DialogHeader>
				<div className="-mx-4 no-scrollbar max-h-[75vh] overflow-y-auto px-4">
					<form
						onSubmit={handleSubmit}
						className="space-y-2">
						<Field className="w-full">
							<FieldLabel>Pegawai</FieldLabel>
							<Select
								onValueChange={(value) => {
									const found = employees?.find((emp) => emp.id === value);
									setSelectedEmployee(found || null);
								}}>
								<SelectTrigger>
									<SelectValue placeholder="Pilih pegawai">{selectedEmployee?.nama}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{employees?.map((employee) => (
										<SelectItem
											key={employee.id}
											value={employee.id}>
											{employee.nama}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
						<div className="space-y-2">
							<Field className="w-full">
								<FieldLabel className="text-center">Shift</FieldLabel>
								<Select
									onValueChange={(value) => {
										const found = shifts?.find((shift) => shift.id === value);
										setSelectedShift(found || null);
									}}>
									<SelectTrigger>
										<SelectValue placeholder="Pilih shift">{selectedShift?.name}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{shifts?.map((shift) => (
												<SelectItem
													key={shift.id}
													value={shift.id}>
													{shift.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={create.isPending}>
							{create.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardClock className="mr-2 h-4 w-4" />}
							{create.isPending ? 'Menambahkan...' : 'Tambahkan'}
						</Button>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};
