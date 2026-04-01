import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth.context';

export const ProtectedRoute = ({ children }: any) => {
	const { session, loading } = useAuth();

	if (loading) return <div>Loading...</div>;

	if (!session) return <Navigate to="/login" />;

	return children;
};
