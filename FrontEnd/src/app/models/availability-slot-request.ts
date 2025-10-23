export interface AvailabilitySlotRequest {
    expertId: number;
    slotDate: string; // YYYY-MM-DD
    startTime: string; // HH:mm:ss
    isPhysical: boolean;
    isVirtual: boolean;
}

export interface ExpertAvailability {
    id?: number;
    expertId: number;
    availableSlotDate: string;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: string;
    isPhysical: boolean;
    isVirtual: boolean;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: ExpertAvailability[];
}

