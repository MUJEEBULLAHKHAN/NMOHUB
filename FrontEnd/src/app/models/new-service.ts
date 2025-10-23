import { Timestamp } from "rxjs";

export class ProjectRequestVM {
  // Email verification model: Maps from C# 'EmailVerifyModel'
  emailverifyModel!: EmailVerifyModel;

  // Project request details: Maps from C# 'ProjectRequest'
  // Make sure the ProjectRequest erface is defined and imported.
  requestModel!: ProjectRequest;

  // User registration details: Maps from C# 'RegisterUserVM'
  userRegisterModel!: RegisterUserVM;
  otherProgramAttend!: OtherProgramAttend;
  partner!: Partner;
  documentlist!: DocumentData[];
}



export class ProjectRequest {
  // Primary Key!: Maps from C# ''
  ProjectID!: number;

  // Employee ID associated with the project!: Maps from C# ''
  EmployeeId!: number;

  // Name of the project!: Maps from C# 'string'
  ProjectName!: string;

  // ID of the package, nullable!: Maps from C# '?'
  PackageId!: number | null;

  CreateAt!: string; // or Date;

  // Status ID of the project!: Maps from C# ''
  StatusId!: number;

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
}

export class RegisterUserVM {
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

export class ProjectRequestResponseVM {
  requestModel = new ProjectRequest;
  Partner = new Partner;
  OtherProgramAttend = new OtherProgramAttend;
  documentlist: DocumentData[] = [];
  projectArea = new ProjectArea;
  projectPhase = new ProjectPhase;
  projectStatus = new ProjectRequest;
  userRegisterModel = new RegisterUserVM;

}

export class SupportNeeds {
  supportNeedId!: number
  supportNeed!: string;
  isChecked: boolean = false;
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

export class DocumentData {
  Base64Data!: any
  DocumentType!: string
  Extension!: string

}

export class RequestList {
  serviceType!: string;
  projectID!: string;
  employeeId!: string;
  serviceId!: number;
  employeeFullName!: string;
  projectName!: string;
  packageId!: string;
  createAt!: string;
  statusId!: string;
  duration!: string;
  programStarted!: string;
  programEnd!: string;
  briefDescription!: string;
  projectStageId!: string;
  projectAreaID!: string;
  isEvaluate!: string;
  aggregateScore!: string;
  ProjectPhaseId!: string;
  isPartnerAvailable!: string;
  alreadyParticipatedProgram!: string;
  isWrittenBusinessPlan!: string;
  hopeAchieve!: string;
  supportsNeeds!: string;
  projectStatus = new Status;
}

export class Status {
statusName : string = "";
}

export class ApproveProjectRequestModel {
  EmployeeId !: number;
  ProjectId !: number;
  ProjectStart !: string;
  ProjectEnd !: string;

  FollowUpStart !: string;
  FollowUpEnd !: string;

  Comments !: string;
}
export class RejectProjectRequestModel {
  EmployeeId !: number;
  ProjectId !: number;
  Comments !: string;
}
export class PitchCompleteRequestModel {
  EmployeeId !: number;
  ProjectId !: number;
  Feedback !: string;
  Documents: DocumentData[] = [];
}

export class ScheduleMeetingModel {
  MeetingId!: number;
  IsVirtual !: boolean;
  Platform !: string;
  Url !: string;
  ServiceId!: any;
  ProjectID !: number;
  EmployeeId  !: number;
  Feedback !: string;
  SlotId!: any;
  ScheduleDate !: string;
  ScheduleTime !: any;
  StartTime: any;//'6:00',
  EndTime: any; //'7:00',
  
}

export class ReviewPitchAndScoreModel {
  EmployeeId!: number;
  ProjectId!: number;
  Review!: string;
  ScoreValue!: number;
}

export class SendProposalModel {
  EmployeeId !: number;
  ProjectId !: number;
  Comments !: string;
  Documents: DocumentData[] = [];
}

export class RejectIdeaModel {
  EmployeeId !: number;
  ProjectId !: number;
  Comments !: string;
}

export class AcceptProposalModel {
  EmployeeId !: number;
  ProjectId !: number;
}

export class RejectProposalModel {
  EmployeeId !: number;
  ProjectId !: number;
  Comments !: string;
}

export class PaymentReceivedModel {
  EmployeeId !: number;
  ProjectId !: number;
}

export class UploadPaymentProofdocModel {
  EmployeeId !: number;
  ProjectId !: number;
  Comments !: string;
  Documents: DocumentData[] = [];
}

export class ProjectArea {
  Id!: number
  Name!: string;
}

export class ProjectPhase {
  Id!: number
  Name!: string;
}

export class PaymentActivity {
  paymentId!: string;
  projectId!: number;
  amount!: string;
  paymentName!: string;
  declineReason!: string;
  isVerified!: boolean;
  transactionReciptUrl!: string;
  createdAt!: string;
  document = new DocumentData;

}

export class BookingSlot {
  startDate!: Date;
  endDate!: Date;
}

export class MeetingSlotRequest {
  SlotDate!: Date;
  StartTime!: any;
}

export class GenerateAvailableSlot{
  slotDate! : Date;
  startTime!: any;
}
export class GenerateDaywiseAvailableSlot{
  slotDate! : Date;
  createdDate!: Date;
  // startTime!: any;
  timeSlots!:[];
}

export class Event {
  id!: number;
  title!: string;
  startTime: any;//'6:00',
  endTime: any; //'7:00',
  date: any; //new Date(2025, 7, 1), // April 1, 2019
  type!: string; //'gray'
  status!: string;
  slotDate: any;
}

export class ProgramActiveRequestModel {
  EmployeeId !: number;
  ProjectId !: number;
  
  ProjectStart !: string;
  ProjectEnd !: string;

  FollowUpStart !: string;
  FollowUpEnd !: string;

  Comments !: string;
}



export class updateModel {
  EmployeeId !: number;
  ProjectId !: number;
  Comments !: string;
}

export class UpdatewithDocModel {
  EmployeeId !: number;
  ProjectId !: number;
  Comments !: string;
  Documents: DocumentData[] = [];
}