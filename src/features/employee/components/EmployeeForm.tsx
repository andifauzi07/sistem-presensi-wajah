import React, { useState } from 'react';
// import { useEmployees } from '../hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera } from '../../attendance/components/Camera';
import { Plus, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';

export const EmployeeForm: React.FC = () => {
	// const { create } = useEmployees();
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!faceDescriptor) return;

		// await create.mutateAsync({ name, email, faceDescriptor });
		setIsOpen(false);
		resetForm();
	};

	const resetForm = () => {
		setName('');
		setEmail('');
		setFaceDescriptor(null);
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
						Tambah Karyawan
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Daftarkan Karyawan Baru</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Nama Lengkap</label>
						<Input
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="John Doe"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Alamat Email</label>
						<Input
							required
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="john@example.com"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Registrasi Wajah</label>
						{faceDescriptor ? (
							<div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
								<CheckCircle2 className="h-5 w-5" />
								<span className="text-sm font-medium">Registrasi Wajah Berhasil</span>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="ml-auto text-green-600 hover:text-green-700 hover:bg-green-100"
									onClick={() => setFaceDescriptor(null)}>
									Ulangi
								</Button>
							</div>
						) : (
							<Camera onCapture={setFaceDescriptor} />
						)}
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={!faceDescriptor}>
						{/* {create.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
						{create.isPending ? 'Mendaftarkan...' : 'Selesai Mendaftarkan'} */}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
