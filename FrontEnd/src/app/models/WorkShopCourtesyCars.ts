export class WorkShopCourtesyCars {
    courtesyCarId!: number;
    vehicleMake!: string;
    vehicleModel!: string;
    registrationNumber!: string;
    mileage!: string;
    isAvailable!: boolean;
    workshopId!: number;
    status!: string;
    image!: string;
  }

  export class CourtesyCarLog {
    courtesyCarLogId!: number;
    courtesyCarId!: number;
    startDate!: Date;
    endDate!: Date;
    returnDate!: Date;
    jobId!: number;
    comments!: string; // Use null for nullable text fields
    returnCarComment!: string | null;
    isActive!: number; // Or boolean if you prefer: IsActive: boolean;
    mileageIn!: number;
    mileageOut!: number;
    dateCaptured!: Date;
    capturedBy!: string | null;
    customerName!: string | null;
    customerEmail!: string | null;
    customerMobile!: string | null;
  }