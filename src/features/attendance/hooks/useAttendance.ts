import { useMutation } from "@tanstack/react-query";
import { apiService } from "@/shared/services/api";
import { toast } from "sonner";

export const useAttendance = () => {
  return useMutation({
    mutationFn: (descriptor: number[]) => apiService.attendance.submit(descriptor),
    onSuccess: (data) => {
      if (data.type === 'check-in') {
        toast.success(`Check-in successful! Welcome, ${data.employee?.name}`);
      } else if (data.type === 'check-out') {
        toast.success(`Check-out successful! Goodbye, ${data.employee?.name}`);
      } else if (data.type === 'already-completed') {
        toast.info('You have already completed your attendance for today.');
      } else if (data.type === 'unknown') {
        toast.error('Face not recognized. Please contact admin.');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to process attendance');
    }
  });
};
