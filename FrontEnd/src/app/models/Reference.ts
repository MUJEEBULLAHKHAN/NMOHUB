export class City {
    id!: number;
    name!: string;
  }

export class ProjectType {
    id!: number;
    name!: string;
  }

  export class ProjectStatus {
    id!: number;
    name!: string;
  }

  export class PaymentStatus {
    id!: number;
    status!: string;
  }
  export class VOService {
  id!: number;
  employeeId!: number;
  serviceId!: number;
  packageId!: number;
  status!: string;
  paymentStatus!: string;
  createdAt!: string;
  service!: Service;   // reuse your existing Service model
  package!: Package;   // reuse your existing Package model
  packageJsonString!: string;
  isNafathVerfied!: boolean;
  statusId!: number;
}

  export class Service {
    id!: number;
    name!: string;
    description!: string;
    hasPackages : boolean = false;
  }

    export class SortPackage {
    serviceName!: string;
    packageList!: pack[];
  }


   export class pack {
    package = new Package;
    serviceName!: string;
  }


  export class Package {
    packageId!: number;
    name!: string;
    price!: number;
    meetingAccessRoomConsume!:number;
    billingPackage!:string;
    features!:string;
    packageValidityInMonth!:number;
    officeAddress!: string;
    updatedDate!: string;
    updatedBy!: number;
    featureList!: any[];
    // serviceId!:number;
    // service!: Service;
    // serviceName!: string;
    // packageDescription!: string;
    // amount!: number;
    // discountPercent!: number;
    // uom!: string;
    // duration!: number;
    // dailyHours!: number;
    // personsQty!: number;
    // packagePlan!: string;
    // createdBy!: number;
  }
export class ServiceRequest {
    id!: number;
    userId!: string;
    serviceId!: number;
    serviceName!: string;
    packageId!: number;
    packageName!: string;
    status!: string;
    paymentStatus!: string;
    entrepreneur: Entrepreneur = new Entrepreneur();
}
export class Entrepreneur {
 firstNames!: string;
 lastName!: string;
    emailAddress!: string;
    password!: string;
    confirmpassword!: string;
    roleIds: number[] = [];
}

export class AdminPages {
    adminPageId!: number;
    adminPageTitle!: string;
    adminPageName!: string;
    adminPageDescription!:string
  }
















export class Country {
    id!: number;
    countryName!: string;
    vatAmount!: number;
  }
  
  export class Currency {
    currencyId!: number;
    currencyName!: string;
    currencySymbol!: string;
  }

  export class Make {
    makeId!: number;
    name!: string;
    logo!: string;
  }

  export class ModelType {
    modelId!: number;
    makeId!: number;
    modelDesc!: string;
    year!: number;
  }

  export class Color {
    colorId!: number;
    colorName!: string;
  }

  export class WorkshopSmsTemplates {
    id!: number;
    workshopId!: number;
    messageTypeId!: number;
    messageType!:string
    messageBody!: string;
  }

  export class WorkshopEmailTemplates {
    emailTemplateId!: number;
    workshopId!:number
    template!: string;
    templateFor!: string;
  }

  export class DocumentTypes {
    documentId!: number;
    documentType!: string;
    documentCode!: string;
  }

  export class Disclaimer {
    disclaimerTypeId!: number;
    disclaimerType!: string;
    disclaimerText!: string;
  }

  export class DepartmentType {
    departmentTypeId!: number;
    type!: string;
    categoryId!: number;
    sequenceId!: number;
    categoryDescription!: string;
  }

  export class DepartmentCategories {
    categoryId!: number;
    categoryDescription!: string;
    isHidden!: boolean;
  }

  export class AnswerType {
    answerTypeId!: number;
    type!: string;
  }

  export class WorkshopSurveyQuestion {
    workshopSurveyQuestionId!: number;
    answerTypeId!: number;
    question!: string;
    isDelete!: boolean;
    isComplete!: boolean;
    type!: string;
    answer!: any;
    answerForRadioButton: boolean = false
  }

  export class WorkshopSurveyQuestionAnswer {
    workshopSurveyQuestionId!: number;
    answerTypeId!: number;
    question!: string;
    answer!: string;
    jobId!: string;
    surveyMasterId!: string;
  }

  export class WorkshopCSIField {
    workshopCSIFieldId!: number;
    workshopCSIFieldTypeId!: number;
    csiField!: string;
    isEnabled!: boolean;
    updatedDate!: string;
  }

  export class WorkshopCSIFieldType {
    key!: number;
    ariaExpanded!: false;
    accordionHeadingclass: string = "";
    accordionDataclass: string = "";
    workshopCSIFieldList!: WorkshopCSIField []
  }

  export class CSISurveyDashboard {
    surveySent!: number;
    surverySentViaSms!: number;
    surveyNotCompleted!: number;
    surveysentViaWhatsApp!: number;
    surveysentViaEmail!: number;
    statisticsQuestionsAndAnswersCompleted!: number;
    statisticsNoLowRatings!: number;
  }

  export class DocumentTemplates {
    documentTemplateId!: number;
    type!:string
    template!: string;
  }

  export class Role {
    id!: string;
    name!: string;
    normalizedName!: string;
    concurrencyStamp!: string;
  }

  export class TaskReferenceDescription {
    id!: number;
    taskDescription!: string;
  }

  export class CommunicationMethod {
    id!: number;
    methodType!: string;
    isEnabled!: boolean;
  }

  export class QualityControlQuestions {
    id!: number;
    question!: string;
    workshopId!: number;
    answerTypeId!: number;
    type!: string;
  }