export class QuoteItem {
    quoteItemId?: number;
    quoteId?: number;
    parentQuoteItemTypeId?: number | null;
    quoteItemTypeId?: number;
    description?: string;
    isAdditional?: boolean;
    repairMethodId?: number | null;
    partType?: string;
    partNumber?: string;
    markup?: number | null;
    amount?: number | null;
    assessorApproved?: boolean | null;
    assessorComments?: string;
    repApprove?: boolean | null;
    userId?: string;
    wUCount?: number | null;
    workUnits?: number | null;
    guideNumber?: number;
    quantity: number = 0;
    hours?: number | null;
    labourRate?: number;
    labourType?: string;
    isDeleted?: number | null;
    partAmountNet?: number | null;
    partAmountInclMarkUp?: number | null;
    labourHours?: number | null;
    labourAmount: number = 0;
    stripAssembleHours?: number | null;
    stripAssembleAmount?: number | null;
    paintAmount?: number | null;
    frameHours?: number | null;
    frameAmount?: number | null;
    otherAmount?: number | null;
    lineNumber?: number | null;
    additionalApproved?:boolean | null;
    additionalActionedBy?:number | null;
    additionalActionedDate?:string | null;
    additionalRequestedDate?:string | null;
    additionalRequestedBy?:number | null;
    notes?:string | null;
    isSelected: boolean = false;
    partChecked?:boolean;
    isBettermentItem?:boolean;
}

export class WorkshopRatesDM {
    rateAgreementId?: number
    companyBranchId?: number
    companyName?: string
    branchName?: string
    workshopId?: number
    partsMarkup?: number
    labourRate?: number
    paintRate?: number
    stripAssemblyRate?: number
    nsrRate?: number
    msrRate?: number
    isWarrantyRate?: any
    isOutOfWarrantyRate?: any
    dateTimeCaptured?: string
    rateDescription?: string
  }