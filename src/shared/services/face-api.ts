import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

export const faceApiService = {
	loadModels: async () => {
		await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL), faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)]);
	},

	detectFace: async (videoElement: HTMLVideoElement) => {
		const options = new faceapi.TinyFaceDetectorOptions({
			inputSize: 416,
			scoreThreshold: 0.7,
		});

		const detection = await faceapi.detectSingleFace(videoElement, options).withFaceLandmarks().withFaceDescriptor();

		return detection;
	},

	getDescriptor: (detection: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>>) => {
		return Array.from(detection.descriptor);
	},
};
