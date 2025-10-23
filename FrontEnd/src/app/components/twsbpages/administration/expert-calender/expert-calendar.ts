export interface TimeSpan {
  ticks: number;
  days: number;
  hours: number;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: number;
  totalMicroseconds: number;
  totalNanoseconds: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface CalendarExpert {
  expertID: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  idType: string;
  idNumber: string;
  profilePicture: string;
  experienceYears: number;
  educationDetails: string;
  linkedInProfileURL: string;
  status: string;
  createdAt: string;
}

export interface ExpertCalendarSlot {
  availabilityId: number;
  expertId: number;
  expert: CalendarExpert;
  availableSlotDate: string;
  startTime: TimeSpan;
  endTime: TimeSpan;
  status: string;
  isPhysical: boolean;
  isVirtual: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarResponse {
  success: boolean;
  message?: string;
  data?: ExpertCalendarSlot[];
}