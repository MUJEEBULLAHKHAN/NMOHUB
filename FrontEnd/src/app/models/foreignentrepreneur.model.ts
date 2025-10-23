// Matches the API response for GetFERequestDetailsbyFeId
export class ForeignEntrepreneurDetailsVM {
  emailverifyModel: EmailVerifyModel | null = null;
  requestModel!: ForeignEntrepreneurRequestModel;
  userRegisterModel!: ForeignEntrepreneurUserRegisterModel;
  documentlist: DocumentData[] = [];
  foreignerStatus!: ForeignEntrepreneurStatus;
}

export class ForeignEntrepreneurRequestModel {
  businessDescription!: string;
  createdAt!: string;
  currentStage!: number;
  employeeId!: number;
  foreignEntrepreneurId!: number;
  otherIndustryDetails!: string;
  otherStageDetails!: string;
  serviceId!: number;
  statusId!: number;
  targetIndustries!: string;
  timeframe!: number;
}

export class ForeignEntrepreneurUserRegisterModel {
  countryId!: number;
  countryName!: string;
  dateOfBirth!: string;
  emailAddress!: string;
  employeeId!: number;
  fullName!: string;
  linkedInProfileLink!: string;
  mobileNumber!: string;
}

export class ForeignEntrepreneurStatus {
  description: string | null = null;
  statusId!: number;
  statusName!: string;
}
export class ForeignEntrepreneurVM {
    requestModel!: ForeignEntrepreneur;
    emailverifyModel!: EmailVerifyModel;
    userRegisterModel!: RegisterUserVM;
    documentlist!: DocumentData[];
}

export class RegisterUserVM {
  fullName!: string;
  CountryId!: number;
  DateOfBirth!: string | null;
  linkedInProfileLink!: string;
  mobileNumber!: string;
  emailAddress!: string;
  Organization!: string;
  countryName: any;
}

export class EmailVerifyModel {
  EmailAddress!: string;
  Otp!: string;
}

export class ForeignEntrepreneur {
  foreignEntrepreneurId!: number;
  id!: number;
  serviceId!: number;
  priorPrograms?: boolean | null;
  priorProgramList?: string | null;
  startupName!: string;
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
  employeeFullName!: string;
  foreignerStatus!: {
    statusId: number;
    statusName: string;
    description: string | null;
  };
   currentStage!: {
   value: number;
   name: string;
 };
 supportTimeframe!: {
   value: number;
   name: string;
 };
}

export class DocumentData {
  id!: number;
  name!: string;
  url!: string;
  uploadedAt!: Date;
}
