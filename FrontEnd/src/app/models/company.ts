export class Company {
    companyId!: number;
    companyName!: string;
    isInsuranceCompany!: boolean | null;
    isTowingCompany!: boolean | null;
    isPartsSupplier!: boolean | null;
  }

  export class CompanyBranch {
    companyBranchId!: number;
    companyTypeId!: number | null;
    branchName!: string;
    telephone!: string;
    faxNo!: string;
    contactPerson!: string;
    emailAddress!: string;
    fullStreetAddress!: string;
    streetAddressName!: string;
    streetAddressNo!: string;
    addressPlace!: string;
    addressTown!: string;
    addressCode!: string;
    postalAddress!: string;
    postalPlace!: string;
    postalCode!: string;
    isPhysicalAddress!: boolean | null;
    province!: string
    vatNo!: string;
    isOem: boolean = false;
    isVatExempt: boolean = false;
    groupHoldingName!: string | null;
    settlementDiscount!: number | null;
    creditLimit!: number | null;
    paymentTermsInDays!: number | null;
    companyTypeDescription!: string;
    //insuranceClaims: InsuranceClaim[]; // Assuming you have an InsuranceClaim interface defined
  }

  export class CompanyTypes {
    id!: number;
    companyTypeDescription!: string;
  }

  export class ExternalCompanyEmail {
    id!: number;
    companyBranchId!: number;
    emailAddress!: string;
  }