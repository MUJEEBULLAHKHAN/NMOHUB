export class UserRM {
    firstName!: string;
    firstNames!: string;
    lastName!: string;
    name!: string;
    employeeId!: string;
    emailAddress!: string;
    homeTelephone!: string;
    mobileNumber!: string;
    streetName!: string;
    streetNo!: string;
    country!: string;
    cityTown!: string;
    workTelephone!: string;
    userId!: string;
    jobTitle!: string;
    roleName!: string; 
    roleId!: number; 
    workshopId!: string;
    workshopName!: string;
    lastLoggedIn!: string;
    signatureUrl!: string;
    isAvailable!: boolean;
  }

  export class RegisterViewModel {
    emailAddress!: string;
    firstNames!: string;
    lastName!: string;
    jobTitle!: string;
    workshopId!: number | null;
    additionalWorkshops!: number[];
    password!: string;
    confirmPassword!: string;
    roleIds!: number[];
    employeeId!: string;
    signatureData!: string;
    signatureUrl!: string;
    isAvailable!: boolean;
    isEnable!: boolean;
  }

  export class roleResponse {
    id!: string;
    name!: string;
    NormalizedName!: string;
    ConcurrencyStamp!: string;
  }

  export class UpdateProfile {
    employeeId!: string;
    signatureData!: string;
    isAvailable!: boolean;
  }