export class Appointment {
    id: number = 0;
    vehicleMakeId!: number;
    vehicleModelId!: number;
    customerName!: string;
    customerMobile!: string;
    customerEmail!: string;
    vehicleRegistration!: string;
    notes!: string;
    scheduledBookInDate!: Date; // Use Date object
    isComplete!: boolean;
    createdDate!: Date;       // Use Date object
    createdBy!: number;
    damageReportNumber:any;
    jobId:any;

}