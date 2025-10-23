import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  public SearchJob(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Search/SearchJob`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public CreateServiceRequest(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ServiceRequest`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
public CreateServiceRequestByAdmin(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ServiceRequest/CreateRequestByAdmin`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
  public GetAllServiceRequests(userId:number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `ServiceRequest/GetAllRequests/` + userId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
  public GetServiceRequestDetails(requestId:number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `ServiceRequest/GetRequest/` + requestId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetAllOpenJobs(pageId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Search/GetAllOpenJobs/` + pageId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetAllClosedJobs(pageId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Search/GetAllClosedJobs/` + pageId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetAllCurrentUsersJobs(pageId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Search/GetAllCurrentUsersJobs/` + pageId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetTodaysDamageReports(pageId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Search/GetTodaysDamageReports/` + pageId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetTodaysRepairOrders(pageId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Search/GetTodaysRepairOrders/` + pageId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetJobCountSnapshot(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Search/GetJobCounts`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetAllJobsByDate(startDate: any, endDate: any, departmentTypeId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Search/GetAllJobsByDate/` + startDate + '/' + endDate + '/' + departmentTypeId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

   public GetAllUserNotifications(employeeId: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Notifications/GetAllUserNotificationsByEmployee/` + employeeId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

}
