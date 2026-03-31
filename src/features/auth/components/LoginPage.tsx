import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { apiService } from '@/shared/services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, LogIn, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { setAuth } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await apiService.auth.login(email, password);
			setAuth(response.token, response.user);
			toast.success('Berhasil Masuk! Selamat datang kembali.');
			navigate('/dashboard');
		} catch (error: any) {
			toast.error(error.message || 'Kredensial tidak valid');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold tracking-tight text-slate-900">RSUD La Mappanenning</h1>
				</div>

				<Card className="border-none shadow-xl">
					<CardHeader className="text-center">
						<img
							src="/image.png"
							alt="RSUD La Mappanenning"
							className="h-20 w-20 bg-transparent mx-auto"
						/>
					</CardHeader>
					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-4 pb-4">
							<div className="space-y-4">
								<label className="text-sm font-medium text-slate-700">Email</label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
									<Input
										required
										type="email"
										placeholder="Masukkan email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
									/>
								</div>
							</div>
							<div className="space-y-4">
								<label className="text-sm font-medium text-slate-700">Kata Sandi</label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
									<Input
										required
										type="password"
										placeholder="Masukkan kata sandi"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-4">
							<Button
								type="submit"
								className="w-full bg-slate-900 text-white hover:bg-slate-800"
								disabled={isLoading}>
								{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
								{isLoading ? 'Proses...' : 'Masuk'}
							</Button>
							<Button
								variant="link"
								onClick={() => navigate('/')}
								className="text-slate-500">
								Kehalaman Presensi
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
};
