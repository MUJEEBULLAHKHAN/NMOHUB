import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }


  public DownloadTrelloPreWipDashboard(categoryIdStart: number, categoryIdEnd: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Dashboard/DownloadTrelloPreWipDashboard?categoryIdStart=` + categoryIdStart + `&categoryIdEnd=` + categoryIdEnd, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public DownloadTrelloPreWipDashboardByServiceAdvisorId(categoryIdStart: number, categoryIdEnd: number, serviceAdvisorId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Dashboard/DownloadTrelloPreWipDashboardByServiceAdvisorId?categoryIdStart=` + categoryIdStart + `&categoryIdEnd=` + categoryIdEnd + `&serviceAdvisorId=` + serviceAdvisorId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public CSISurveyDashboard(model: any): Observable<HttpResponse<any>> {

    return this.http.post<any>(environment.baseAPIUrl + `WorkshopSurvey/CSISurveyDashboard`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public SendServey(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `WorkshopSurvey/SendServey`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetMessageTemplate(Id: number, jobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `ContactClients/GetMessageTemplate/`+ Id + `/` + jobId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

    public GetWhatsAppMessageTemplate(Id: number, jobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `ContactClients/GetWhatsAppMessageTemplate/`+ Id + `/` + jobId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetServeyByJob(JobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`WorkshopSurvey/GetAllSurvey/${JobId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }


  public JobsByStatusAndServiceProvider(serviceAdvisorId: number, categoryId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Dashboard/JobsByStatusAndServiceProvider?serviceAdvisorId=` + serviceAdvisorId + `&categoryId=` + categoryId, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public JobsServiceProviderByCategory(departmentCategoryId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Dashboard/JobsServiceProviderByCategory/${departmentCategoryId}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public JobsByServiceProviderCategoryId(departmentCategoryId: number,  serviceAdvisorId:any, pageId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Dashboard/JobsByServiceProviderCategoryId/${departmentCategoryId}/${serviceAdvisorId}/${pageId}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
  
}