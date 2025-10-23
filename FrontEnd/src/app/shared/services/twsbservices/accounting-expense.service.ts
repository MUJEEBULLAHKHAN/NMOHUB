import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountingExpenseService {

  constructor(private http: HttpClient) { }

  public GetExpensesByJob(jobId: any): Observable<any> {
    return this.http.get<any>(environment.baseAPIUrl + `AccountingExpense/GetExpensesByJob/` + jobId);
  }
  public GetExpensesCategories(): Observable<any> {
    return this.http.get<any>(environment.baseAPIUrl + `References/GetAllExpenseCategories`);
  }

  public GetVendorDropdown(): Observable<any> {
    return this.http.get<any>(environment.baseAPIUrl + `References/GetAllVendorsDropdown`);
  }

  public GetVatPercentage(): Observable<any> {
    return this.http.get<any>(environment.baseAPIUrl + `References/GetVatPercentage`);
  }


  public AddExpense(model: any, jobId: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `AccountingExpense/AddJobExpense/` + jobId, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public MarkExpenseAsPaid(jobId:any,expenseId:any,model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `AccountingExpense/MarkExpenseAsPaid/`+jobId+'/'+expenseId, model,{
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  // public MarkExpenseAsPaid(jobId:any,expenseId:any): Observable<any> {
  //   return this.http.get<any>(environment.baseAPIUrl + `AccountingExpense/MarkExpenseAsPaid/`+jobId+'/'+expenseId);
  // }

  public VoidExpenseTransaction(jobId:any,expenseId:any): Observable<any> {
    return this.http.get<any>(environment.baseAPIUrl + `AccountingExpense/VoidExpenseTransaction/`+jobId+'/'+expenseId);
  }

  public DownloadExpensesToExcel(jobId:any): Observable<any> {
    return this.http.get<any>(environment.baseAPIUrl + `AccountingExpense/DownloadExpensesViaCSV/`+jobId);
  }

  public GenerateExpenseReportWithDateCritria(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `AccountingExpense/GenerateExpenseReportWithDateCritria`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GenerateExpenseDashboardTiles(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `AccountingExpense/GenerateExpenseDashboardTiles`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public ExportExpenseToExcelByDate(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `AccountingExpense/DownloadExpensesFilteredByDate`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GenerateBackOrderReportWithDateCritria(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Report/GenerateBackOrderReportWithDateCritria`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GenerateWorkInProgressReport(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Report/GenerateWorkInProgressReport`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetDepartmentWithCountsByCategory(categoryId:number,model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Report/GetDepartmentWithCountsByCategory/`+categoryId, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public DownloadWorkInProgressReport(categoryId:any,model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Report/DownloadWorkInProgressReport/`+categoryId, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
  
}
