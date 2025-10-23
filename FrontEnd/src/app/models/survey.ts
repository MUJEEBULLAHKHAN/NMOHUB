
export class ContactClient {
    contactClientId!: number
    jobId!: number
    surveyMasterId!: number
    note!: string
    smsNumber!: string
    emailAddress!: string
    sendSms!: boolean
    sendEmail!: boolean
    communicationType!: string
    date!: string
    createdBy!: string
    isCollapsed : boolean = false
    templateSentDescription:any;
    deliveryStatus:any;
    isInBoundMessage!:boolean;
  }
