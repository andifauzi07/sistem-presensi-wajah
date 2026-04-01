import React, { useEffect, useRef, useState } from 'react';
import { faceApiService } from '@/shared/services/face-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Camera as CameraIcon } from 'lucide-react';

interface CameraProps {
	onCapture: (descriptor: number[]) => void;
	isLoading?: boolean;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, isLoading }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isModelLoaded, setIsModelLoaded] = useState(false);
	const [isCameraReady, setIsCameraReady] = useState(false);
	const [isDetecting, setIsDetecting] = useState(false);
	const [cameraError, setCameraError] = useState<string | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				await faceApiService.loadModels();
				setIsModelLoaded(true);
				await startCamera();
			} catch (error) {
				console.log('Gagal Memuat Model');
				setCameraError('Gagal memuat model pendeteksi wajah.');
			}
		};
		init();

		return () => {
			if (videoRef.current?.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	const startCamera = async () => {
		try {
			setCameraError(null);
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				setIsCameraReady(true);
			}
		} catch (error: any) {
			console.error('Gagal Memulai Kamera', error);
			if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
				setCameraError('Akses kamera ditolak. Harap izinkan akses kamera di pengaturan browser Anda dan segarkan halaman.');
			} else {
				setCameraError('Kamera tidak dapat diakses. Pastikan kamera terhubung dan tidak sedang digunakan oleh aplikasi lain.');
			}
		}
	};

	const handleCapture = async () => {
		if (!videoRef.current || !isModelLoaded) return;

		setIsDetecting(true);
		try {
			const detection = await faceApiService.detectFace(videoRef.current);
			if (detection) {
				const descriptor = faceApiService.getDescriptor(detection);
				onCapture(descriptor);
			} else {
				alert('No face detected. Please ensure your face is clearly visible.');
			}
		} catch (error) {
			console.error('Detection error', error);
		} finally {
			setIsDetecting(false);
		}
	};

	return (
		<Card className="p-4 flex flex-col items-center gap-4">
			<div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
				{cameraError ? (
					<div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center bg-slate-900">
						<p className="text-sm mb-4 text-slate-300">{cameraError}</p>
						<Button
							variant="secondary"
							size="sm"
							onClick={startCamera}>
							Coba Lagi
						</Button>
					</div>
				) : (
					!isCameraReady && (
						<div className="absolute inset-0 flex items-center justify-center text-white">
							<Loader2 className="animate-spin" />
						</div>
					)
				)}
				<video
					ref={videoRef}
					autoPlay
					muted
					playsInline
					className={`w-full h-full object-cover scale-x-[-1] ${cameraError ? 'hidden' : 'block'}`}
				/>
				{isDetecting && (
					<div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
						<div className="flex flex-col items-center gap-2">
							<Loader2 className="animate-spin" />
							<span>Mendeteksi Wajah ...</span>
						</div>
					</div>
				)}
			</div>

			<Button
				onClick={handleCapture}
				disabled={!isCameraReady || isDetecting || isLoading || !!cameraError}
				className="w-full max-w-xs">
				{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CameraIcon className="mr-2 h-4 w-4" />}
				{isLoading ? 'Proses...' : 'Verifikasi Identitas'}
			</Button>
		</Card>
	);
};
