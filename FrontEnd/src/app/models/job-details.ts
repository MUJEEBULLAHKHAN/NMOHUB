import { QuoteItem } from '../models/PostModels/QuoteItem';

export class JobOverview {
  clientName!: string
  clientEmail!: string
  clientAddress!: string
  clientMobileNumber!:any;
  }


  export class JobTask {
    jobTaskId!: number;
    jobId!: number;
    // createdBy!: number;
    assignTo!: number;
    createdDate?: Date | null;
    workshopId!: number;
    taskList!: JobTaskDetails[];
  }
  
  export class JobTaskDetails {
     jobId!: number
    // jobTaskDetailId!: number;
    taskDescription!: string;
    startDate?: Date | null;
    endDate?: Date | null;
    // isTaskCompleted!: boolean;
    assignTo: number = 0;
    quoteItemsList!: QuoteItem[]
  }

  export class TaskReferenceDescription {
    id!: number;
    taskDescription!: string;
    // startDate!: Date;
    // endDate!: Date;
    // isTaskCompleted!: boolean;
    // assignTo: number = 0;
  }