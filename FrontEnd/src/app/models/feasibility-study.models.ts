export class FeasibilityStudyVM
{
    requestModel!: FeasibilityStudy
   emailverifyModel!: EmailVerifyModel;
   userRegisterModel!: RegisterUserVM;
    documentlist!: DocumentData[];

}

export class RegisterUserVM {
  // Full name of the user: Maps from C# 'string'
  fullName!: string;

  // Country of residence: Maps from C# 'string'
  CountryId!: number;

  // Date of birth, nullable: Maps from C# 'DateTime?'
  // Typically received as an ISO string from the backend.
  DateOfBirth!: string | null; // or Date | null;

  // Mobile number: Maps from C# 'string'
  mobileNumber!: string;

  // Email address: Maps from C# 'string'
  emailAddress: string = "";

  // LinkedIn profile link: Maps from C# 'string'
  Organization!: string;
  countryName: any;
}

export class EmailVerifyModel {
  // Email address for verification: Maps from C# 'string'
  EmailAddress!: string;

  // One-Time Password (OTP): Maps from C# 'string'
  Otp!: string;
}

export class FeasibilityStudy
{
     Id! : number
     ServiceId! : number
     ProjectName! : string
     IndustrySector! : string
     EstimatedBudget! : number
     StudyObjectives! : string
     KeyAssumptions! : string
     HasMarketResearch! : boolean
     ResearchDocsUrl! : string
     MarketReportsUrl! : string
     FinancialSpreadsheetsUrl! : string
     EmployeeId! : number
     PackageId! : number
     CreateAt! : Date
     StatusId! : number
     Duration! : number
     ProgramStarted! : Date
     ProgramEnd! : Date
     BriefDescription! : string
     ProjectPhaseId! : number
     ProjectAreaID! : number
     IsEvaluate! : boolean
     AggregateScore! : number
     CurrentPhaseId! : number
     IsPartnerAvailable! : boolean
     AlreadyParticipatedProgram! : boolean
     IsWrittenBusinessPlan! : boolean
     HopeAchieve! : string
     SupportsNeeds! : string
     CaseId! : string;
     FollowUpStart! : Date
     FollowUpEnd! : Date

}

export class DocumentData {
  Base64Data!: any
  DocumentType!: string
  Extension!: string

}

export class ProjectRequestResponse {
  requestModel = new ProjectRequest;
  //Partner = new Partner;
  //OtherProgramAttend = new OtherProgramAttend;
  documentlist : DocumentData[] = [];
  // projectArea = new ProjectArea;
  // projectPhase = new ProjectPhase;
  projectStatus = new ProjectRequest;
  userRegisterModel = new RegisterUserVM();
  vehicleLogoUrl!: string;

}


export class ProjectRequest {
  statusId!: number;
  statusName!: string;
  projectName!: string;
  hasMarketResearch: any;
keyAssumptions: any;
studyObjectives: any;
estimatedBudget: any;
industrySector:any;
employeeId: any;

}
