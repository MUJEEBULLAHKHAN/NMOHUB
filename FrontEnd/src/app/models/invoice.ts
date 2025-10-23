export class InvoiceModel {
  createdBy?: number ;
  jobId?: number;
  workshopId?: number;
  invoiceFrom?: InvoiceFrom;
  repairOrderNumber?: string;
  todaysdate?: string;
  invoiceTo?: InvoiceTo;
  vehicle?: VehicleDetail;
  insuranceDetail?: InsuranceDetail;
  clientDetail?: ClientDetail;
  invoiceList?: InvoiceList[];
  InvoiceItemListAfterTotalIncludingVat?:InvoiceItemListAfterTotalIncludingVat[];
  invoiceDate?: Date;
  totals?: Totals;
  invoiceNumber?: string;
  invoiceId?: number;
  importDataFrom?: any;
  generalInvoiceNotes?:any;
  emailBody?:any;
  emailSubject?:any;
  recipientEmail?:any;
  invoiceSubmissionType?:any;
}

export class InvoiceFrom {
  name?: string;
  emailAddress?: string;
  telephoneNumber?: string;
  fullAddress?: string;
  logo?: string;
  bankAccountNumber?: string;
  bankBranchCode?: string;
  bankAccountType?: string;
  bankName?: string;
  vatNumber?: string;
  vatPercentage?:number;
}

export class InvoiceTo {
  name?: string='';
  streetAddress?: string;
  cityAddress?: string;
  suburbAddress?: string;
  telephoneNumber?: string;
  emailAddress?: string;
  vatNo?: string;
  purchaseOrder?: string='';
  orderNumber?: string='';
  fullAddress?: string='';
  billTo?: string='';
  id?: number;
}

export class InvoiceList {
  description?: string;
  amountExVat?: number;
  vatAmount?:number;
  amountInclVat?:number;
  itemCode?: string;
}

export class InvoiceItemListAfterTotalIncludingVat {
  description?: string;
  amountExVat?: number;
  vatAmount?:number;
  amountInclVat?:number;
  itemCode?: string;
}

// You'll need to create interfaces for these based on your requirements:
export class VehicleDetail {
  engineNo?: string;
  colorId?: string;
  vinNumber?: string;
  registrationNumber?: string;
  registrationDate?: string;
  odometer?: string;
  underWarranty?: boolean;
  makeId?: number;
  makeDesc?: string;
  modelId?: number;
  modelDesc?: string;
  vehicleId?: number;
  logo?: string;
}

export class InsuranceDetail {
  branchName?: string;
  claimNo?: string;
  fullName?: string;
}

export class ClientDetail {
  // ... properties of ClientDetail
}


export class Totals {
  //nettTotal?: number;
  disAmt?: number;
  subTotal?: number;
  vatPercentage?: number;
  totalVatAmount?: number;
  totalInclVatAmount?: number;
  discountPercentage?: number;
  grandTotal?: number;
}