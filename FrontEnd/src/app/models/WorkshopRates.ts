export class WorkshopRate {
    rateAgreementId!: number;
    dateTimeCaptured!: Date;
    capturedBy!: number;
    workshopId!: number;
    companyBranchId!: number;
    branchName!: string;
    labourRate!: number;
    paintRate!: number;
    partsMarkup!: number;
    stripAssemblyRate!: number;
    isOutOfWarrantyRate!: boolean;
    isWarrantyRate!: boolean;
    msrRate!: number;
    nsrRate!: number;
    rateDescription!: string;
    partSundryPercent!: number;
    paintSundryPercent!: number;
  }