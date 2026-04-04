import React from 'react';
import { useEmployees } from '../employee.hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, User } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export const EmployeeList: React.FC = () => {
	const { data: employees, isLoading: employeeLoading, create: employeeCreateMutation, delete: employeeDeleteMutation } = useEmployees();

	return (
		<div className="border rounded-lg bg-white overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-slate-50/50">
						<TableHead className="w-20">Profile</TableHead>
						<TableHead>Nama</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Bergabung Pada</TableHead>
						<TableHead className="text-right">Aksi</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employeeLoading || employeeCreateMutation.isPending || employeeDeleteMutation.isPending ? (
						<TableSkeleton
							rows={5}
							columns={5}
							showAvatar
						/>
					) : (
						employees?.map((employee) => (
							<TableRow
								key={employee.id}
								className="hover:bg-slate-50/50 transition-colors">
								<TableCell>
									<Avatar className="h-10 w-10 border-2 border-slate-100">
										<AvatarFallback className="bg-slate-100 text-slate-600">
											<User className="h-5 w-5" />
										</AvatarFallback>
									</Avatar>
								</TableCell>
								<TableCell className="font-medium text-slate-900">{employee.nama}</TableCell>
								<TableCell className="text-slate-500">{employee.email}</TableCell>
								<TableCell className="text-slate-500">{new Date(employee.created_at).toLocaleDateString()}</TableCell>
								<TableCell className="text-right">
									<Button
										variant="ghost"
										size="icon"
										className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
										onClick={() => employeeDeleteMutation.mutateAsync(employee?.id)}
										disabled={employeeDeleteMutation.isPending}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
					{employees?.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-32 text-center text-slate-500">
								No employees registered yet.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};
