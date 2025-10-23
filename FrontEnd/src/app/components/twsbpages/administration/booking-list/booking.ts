export interface Booking {
  bookingId: number;
  expertId: number;
  bookedBy: number;
   projectId: number;
  availabilityId: number;
  sessionDateTime: string;
  meetingType: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentId: number;
  sessionLink: string;
  locationDetails: string;
  cancellationReason: string;
  rescheduleHistory: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  data?: Booking[];
}
export interface BookingRequest {
  expertId: number;
  bookedBy: number;
  projectId: any;
  availabilityId: number;
  sessionDateTime: string;
  meetingType: 'Physical' | 'Virtual';
  bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentId?: number;
  sessionLink?: string;
  locationDetails?: string;
  cancellationReason?: string;
  rescheduleHistory?: string;
}

export interface BookingResponse {
  bookingId: number;
  expertId: number;
  bookedBy: number;
  availabilityId: number;
  sessionDateTime: string;
  meetingType: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentId: number;
  sessionLink: string;
  locationDetails: string;
  cancellationReason: string;
  rescheduleHistory: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: BookingResponse;
}