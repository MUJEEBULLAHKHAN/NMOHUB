export interface CalendarEvent {
  eventId: number;
  expertId: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  eventType: 'Availability' | 'Booking' | 'Blocked';
  status: string;
  meetingType?: 'Physical' | 'Virtual';
  bookingStatus?: string;
  customerId?: number;
  customerName?: string;
  location?: string;
  sessionLink?: string;
}

export interface CalendarResponse {
  success: boolean;
  message?: string;
  data?: CalendarEvent[];
}