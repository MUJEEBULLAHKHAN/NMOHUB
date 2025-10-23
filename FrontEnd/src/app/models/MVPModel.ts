

export class MVPProgramVM {
  emailverifyModel!: MVPEmailVerifyModel;
  requestModel!: MvpProgram;
  userRegisterModel!: MVPRegisterUserVM;
  documentlist!: MVPDocumentData[];
}

export class MVPEmailVerifyModel {
  emailAddress!: string;
  otp!: string;
}

export class MvpProgram {
  id!: number;
  serviceId!: number;
  projectName!: string;
  projectDescription!: string;
  desiredTechStack!: string;
  uiMockupsUploaded!: boolean;
  mockupFileUrl?: string;
  prototypeLink!: string;

  desiredLaunchDate!: Date;
  estimatedBudget!: number;

  apiSpecificationsUrl?: string;
  designAssetsUrl?: string;

  employeeId!: number;
  packageId?: number;
  createAt!: Date;
  statusId!: number;
  duration!: number;
  programStarted?: Date;
  programEnd?: Date;
  briefDescription!: string;
  projectPhaseId!: number;
  projectAreaID!: number;
  isEvaluate!: boolean;
  aggregateScore?: number;
  currentPhaseId?: number;
  isPartnerAvailable!: boolean;
  alreadyParticipatedProgram!: boolean;
  isWrittenBusinessPlan!: boolean;
  hopeAchieve!: string;
  supportsNeeds!: string;
  caseId: string = '';

  followUpStart?: Date;
  followUpEnd?: Date;
}

export class MVPRegisterUserVM {
  fullName!: string;
  countryId!: number;
  dateOfBirth?: Date;
  mobileNumber!: string;
  emailAddress!: string;
  linkedInProfileLink!: string;
  countryName!: string; // NotMapped in C#, still needed in UI
}


export class MVPDocumentData {
  base64Data!: string;
  documentType!: string;
  extension!: string;
}


export class Skill {
  SkillId!: number
  SkillName!: string;
  isChecked: boolean = false;
}