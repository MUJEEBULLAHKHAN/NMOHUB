export class Workshops {
    addressName!: string;
    emailAddress!: string;
    fullAddress!: string;
    postalCode!: string;
    streetAddress!: string;
    suburbAddress!: string;
    cityAddress!: string;
    registrationNumber!: string;
    telephoneNumber!: string;
    vatNumber!: string;
    workshopId!: number;
    workshopName!: string;
    workshopLogo!: string; // Possibly adjust data type based on API response
    vatPercentage!: number;
    id!: number;
    countryName!: string;
    vatAmount!: number;
    currencyId!: number;
    currencyName!: string;
    currencySymbol!: string;
    countryId!: number | null;
    abbreviation!: string;
    faxNumber!: string;
    addressNumber!: string;
    addressCode!: string;
    latitude!: number | null;
    longitude!: number | null;
    bamsWorkshopCode!: string;
    bamsPassword!: string;
    smsUserName!: string;
    smsKey!: string;
    autoMxId!: number | null;
    postalAddressLine1!: string;
    dbConnectionString!: string;
    allowStatusToBeAssignedToMultipleUsers!: boolean;
    allowDiscountOnQuotation!: boolean;
    allowDiscountOnInvoice!: boolean;
    azContainerName!: string;
    workshopBankAccounts!: WorkshopBankAccounts;
}

export class WorkshopBankAccounts {
    workshopAccountId?: number;
    workshopId?: number;
    bankName?: string;
    bankAccountNumber?: string;
    bankBranchCode?: string;
    bankAccountType?:string;
    isActive?: boolean;
  }
  
  export class InvoiceDetails {
    Id: number = 0;
    Name!: string;
    Email!: string;
    Address!: string;
    MobileNumber!: string;
    subTotal: number =0;
    discountAmount: number =0;
    discountPercentage: any;
    totalVatAmount: number =0;
    totalInclVatAmount: number =0;
    grandtotalAmount: number =0;
    vatPercentage: number =0;
    workshopId: number = 0;
    invoiceNumber: any;
    invoiceId: any;
    paid: any;
    importDataFrom: any;
    insuranceClaimNumber: any;
    vehicleMake: any;
    vehicleModel: any;
    invoiceFile: any;
  }

  export class InvoiceLineItem {
    itemCode!: string;
    description!: string;
    shortDescription!:any;
    invoiceDiplayDescription!:any;
    amountExVat!: number;
    vatAmount!: number;
    amountInclVat!: number;
    showItemDetail:boolean=false;
  }

  export class InvoiceMail {
    fromEmail!: string;
    RecipientAddress!: string;
    RecipientAddressCc!: string;
    RecipientAddressBcc!: string;
    SubjectLine!: string;
    Body!: string;
    AttachmentPath!: string;
    JobId!: number;
  }