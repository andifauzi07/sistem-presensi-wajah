import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { AttendancePage } from './features/attendance/components/AttendancePage';
import { LoginPage } from './features/auth/components/LoginPage';
import { DashboardPage } from './features/dashboard/components/DashboardPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { AuthProvider } from './features/auth/auth.context';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						{/* Public Routes */}
						<Route
							path="/"
							element={<AttendancePage />}
						/>
						<Route
							path="/login"
							element={<LoginPage />}
						/>

						{/* Protected Routes */}

						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashboardPage />
								</ProtectedRoute>
							}
						/>

						{/* Fallback */}
						<Route
							path="*"
							element={
								<Navigate
									to="/"
									replace
								/>
							}
						/>
					</Routes>
					<Toaster
						position="top-right"
						richColors
					/>
				</BrowserRouter>
			</AuthProvider>
		</QueryClientProvider>
	);
}
