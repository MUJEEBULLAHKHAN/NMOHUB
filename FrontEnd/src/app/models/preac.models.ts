export class PreAcceleratorVM
{
    requestModel!: PreAccelerator
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
linkedInProfileLink!: string
  // Mobile number: Maps from C# 'string'
  mobileNumber!: string;

  // Email address: Maps from C# 'string'
  emailAddress!: string;

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

export class PreAccelerator {
  id!: number;
  serviceId!: number;
  
  priorPrograms?: boolean | null;
  priorProgramList?: string | null;

  startupName!: string;
  currentStage!: string;
  businessModelCanvasUrl!: string;
  pitchDeckUrl!: string;
  teamSize!: number;
  problemSolved!: string;

  goals?: string | null;
  availability!: number;

  employeeId!: number;
  packageId?: number | null;
  createAt!: Date;
  statusId!: number;
  duration!: number;
  programStarted?: Date | null;
  programEnd?: Date | null;
  briefDescription!: string;
  projectPhaseId!: number;
  projectAreaID!: number;
  isEvaluate!: boolean;
  aggregateScore?: number | null;
  currentPhaseId?: number | null;
  isPartnerAvailable!: boolean;
  alreadyParticipatedProgram!: boolean;
  isWrittenBusinessPlan!: boolean;
  hopeAchieve!: string;
  supportsNeeds!: string;
  caseId!: string;

  followUpStart?: Date | null;
  followUpEnd?: Date | null;
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
  userRegisterModel = new RegisterUserVM;
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

}
