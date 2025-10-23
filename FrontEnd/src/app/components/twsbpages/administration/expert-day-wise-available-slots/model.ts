export interface TimeSlot {
  startTime: string; // HH:mm:ss
}

export interface DailyAvailabilitySlotRequest {
  expertId: number;
  createdDate?: string; // YYYY-MM-DD
  slotDate: string; // YYYY-MM-DD
  isPhysical: boolean;
  isVirtual: boolean;
  timeSlots: TimeSlot[];
}

export interface ExpertAvailability {
  availabilityId: number;
  expertId: number;
  availableSlotDate: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  isPhysical: boolean;
  isVirtual: boolean;
  isChecked: boolean;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: ExpertAvailability[];
}
// export interface ExpertAvailability {
//   id: number;
//   expertId: number;
//   availableSlotDate: string;
//   startTime: string;
//   endTime: string;
//   status: string;
//   createdAt: string;
//   isPhysical: boolean;
//   isVirtual: boolean;
// }

export interface AvailabilityResponse {
  success: boolean;
  message?: string;
  data?: ExpertAvailability[];
}