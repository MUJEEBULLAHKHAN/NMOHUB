
export class ProjectRequest {
  // Primary Key!: Maps from C# ''
  ProjectID!: number;

  // Employee ID associated with the project!: Maps from C# ''
  EmployeeId!: number;

  // Name of the project!: Maps from C# 'string'
  projectName!: string;

  // ID of the package, nullable!: Maps from C# '?'
  PackageId!: number | null;

  CreateAt!: string; // or Date;

  // Status ID of the project!: Maps from C# ''
  statusId!: number;

  // Duration of the project!: Maps from C# ''
  Duration!: number;

  // Start date/time of the program, nullable!: Maps from C# 'DateTime?'
  // Again, 'string | null' is often practical for dates from APIs.
  ProgramStarted!: string | null; // or Date | null;

  // End date/time of the program, nullable!: Maps from C# 'DateTime?'
  ProgramEnd!: string | null; // or Date | null;

  // Brief description of the project!: Maps from C# 'string'
  BriefDescription!: string;

  // Stage ID of the project!: Maps from C# ''
  projectPhaseId!: number;

  // Area ID of the project!: Maps from C# ''
  ProjectAreaID!: number;

  // Flag indicating if the project is evaluated!: Maps from C# 'bool'
  IsEvaluate!: boolean;

  // Aggregate score, nullable!: Maps from C# 'double?'
  AggregateScore!: number | null;

  // Current phase ID, nullable!: Maps from C# '?'
  ProjectPhaseId!: number | null;

  // Flag indicating if a partner is available!: Maps from C# 'bool'
  IsPartnerAvailable!: boolean;

  // Flag indicating if already participated in a program!: Maps from C# 'bool'
  AlreadyParticipatedProgram!: boolean;

  // Flag indicating if a business plan is written!: Maps from C# 'bool'
  IsWrittenBusinessPlan!: boolean;

  // Hopes to achieve from the project!: Maps from C# 'string'
  HopeAchieve!: string;

  // Supports and needs for the project!: Maps from C# 'string'
  SupportsNeeds!: string;
  statusName!: string;
  employeeId!:number;
  
}

export class RegisterUserVM {
  employeeId !: number;
  // Full name of the user: Maps from C# 'string'
  FullName!: string;

  // Country of residence: Maps from C# 'string'
  CountryId!: number;

  // Date of birth, nullable: Maps from C# 'DateTime?'
  // Typically received as an ISO string from the backend.
  DateOfBirth!: string | null; // or Date | null;

  // Mobile number: Maps from C# 'string'
  MobileNumber!: string;

  // Email address: Maps from C# 'string'
  EmailAddress!: string;

  // LinkedIn profile link: Maps from C# 'string'
  LinkedInProfileLink!: string;
}

export class EmailVerifyModel {
  // Email address for verification: Maps from C# 'string'
  EmailAddress!: string;

  // One-Time Password (OTP): Maps from C# 'string'
  Otp!: string;
}

export class ProjectRequestResponse {
  requestModel = new ProjectRequest;
  Partner = new Partner;
  OtherProgramAttend = new OtherProgramAttend;
  documentlist : DocumentData[] = [];
  projectArea = new ProjectArea;
  projectPhase = new ProjectPhase;
  projectStatus = new ProjectRequest;
  userRegisterModel = new RegisterUserVM;
  vehicleLogoUrl!: string;

}


export class DocumentData {
  Base64Data!: any
  DocumentType!: string
  Extension!: string

}


export class Partner {
  PartnerId!: number;
  PartnerName!: string;
  ProjectId!: number;
  Role!: string;
}

export class OtherProgramAttend {

  ProgramId!: number
  ProjectId!: number
  IncubatorName!: string
  Details!: string
}

export class ProjectArea
{
    Id!: number
    Name!: string;
}

export class ProjectPhase
{
    Id!: number
    Name!: string;
}

