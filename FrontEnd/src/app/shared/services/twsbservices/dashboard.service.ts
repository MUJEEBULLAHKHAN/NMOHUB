import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

 
  public DownloadTrelloPreWipDashboard(categoryIdStart: number, categoryIdEnd: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Dashboard/DownloadTrelloPreWipDashboard?categoryIdStart=`+categoryIdStart + `&categoryIdEnd=`+ categoryIdEnd, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public DownloadTrelloPreWipDashboardByServiceAdvisorId(categoryIdStart: number, categoryIdEnd: number, serviceAdvisorId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Dashboard/DownloadTrelloPreWipDashboardByServiceAdvisorId?categoryIdStart=`+categoryIdStart + `&categoryIdEnd=`+ categoryIdEnd + `&serviceAdvisorId=`+ serviceAdvisorId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CSISurveyDashboard(model: any): Observable<HttpResponse<any>> {
   
    return this.http.post<any>(environment.baseAPIUrl +`WorkshopSurvey/CSISurveyDashboard`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetMainDashboardStats(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `DashboardLandingAnalytics/DashboardWithOverallStats`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetPendingPartCreditReport(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Report/GetPendingPartCredits`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }



  public GetActivitiesByDepartmentId(departmentId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Report/GetActivitiesByDepartmentId/`+departmentId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetJobsByDepartmentIdAndActivityId(departmentId:any,activityId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Report/GetJobsByDepartmentIdAndActivityId/`+departmentId+'/'+activityId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
}