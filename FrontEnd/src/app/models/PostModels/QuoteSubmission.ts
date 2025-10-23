import { QuoteItem } from "./QuoteItem";

export class QuoteSubmission
{
    jobId:any;
    discountAmount?:number;
    discountPercentage?:number;
    partSundriesPercentage?:number;
    partSundriesAmount?:number;
    paintSundriesPercentage?:number;
    paintSundriesAmount?:number;
    quoteItems?:QuoteItem[];
}