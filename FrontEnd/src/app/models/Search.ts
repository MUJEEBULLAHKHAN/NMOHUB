export class ClaimSearchModel {
    claimNo!: string;
    registrationNumber!: string;
    assessmentNumber!: string;
    repairOrderNumber!: string;
    damageReportNumber!: string;
  }

  export class ClaimSearchResponse {
    vehicleMake!: string;
    claimNo!: string;
    updatedBy!: string;
    workshopName!: string;
    status!: string;
    jobDate!: string
  }