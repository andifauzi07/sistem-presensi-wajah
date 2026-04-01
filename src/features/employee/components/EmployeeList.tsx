import React from 'react';
import { useEmployees } from '../employee.hooks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, User, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const EmployeeList: React.FC = () => {
	const { data: employees, isLoading } = useEmployees();

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<Skeleton
						key={i}
						className="h-16 w-full"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="border rounded-lg bg-white overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-slate-50/50">
						<TableHead className="w-[80px]">Profile</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Joined Date</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employees?.map((employee) => (
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
								{/* <Button
									variant="ghost"
									size="icon"
									className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
									onClick={() => deleteMutation.mutate(employee.id)}
									disabled={deleteMutation.isPending}>
									{deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
								</Button> */}
							</TableCell>
						</TableRow>
					))}
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
