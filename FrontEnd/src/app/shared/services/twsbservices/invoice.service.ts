import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient ) { }

  public CreateInvoiceModel(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`Invoices/PostInvoiceModel`, model);
  }

  public EmailInvoice(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`Invoices/EmailInvoice`, model);
  }

  public GetAllInvoicesByJobId(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`Invoices/RetreiveAllInvoices/`+jobId);
  }

  public GetInvoicesByDates(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`Invoices/GetInvoicesByDates`,model);
  }

  public GetReportingInvoiceSummary(): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`Invoices/GetInvoiceTotalSummaryReport`);
  }

  public InvoicePaid(invoiceId: any,jobId:any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`Invoices/InvoicePaid/`+invoiceId+'/'+jobId);
  }

  public GetInvoiceTotalSummaryByJob(jobId:any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`Invoices/GetInvoiceTotalsSummaryForJob/`+jobId);
  }

  downloadFile(fileUrl: string): Observable<Blob> {
    return this.http.get(fileUrl, {
      headers: new HttpHeaders(),
      responseType: 'blob', // Important to get the response as a blob
    });
  }

  public GetInvoiceTotalsSelection(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`Invoices/GetInvoiceTotalsSelection/`+jobId);
  }

  public GetBillToClients(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`Invoices/GetBillToClients/`+jobId);
  }

  // public EditJob(model: any): Observable<any>{
  //   return this.http.post<any>(environment.baseAPIUrl +`JobDetails/EditJob`, model);
  // }

  // public GetTimeLineByJobId(jobId: any): Observable<any>{
  //   return this.http.get<any>(environment.baseAPIUrl +`JobActivities/GetTimeLineByJobId/`+jobId);
  // }

  // public GetJobOverview1(jobId: any): Observable<any>{
  //   return this.http.get<any>(environment.baseAPIUrl +`JobDetails/GetJobOverview1/`+jobId);
  //}

}
