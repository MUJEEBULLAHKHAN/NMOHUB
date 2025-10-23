import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopNotificationService {

  constructor(private http: HttpClient) {
  }

  public GetUnreadNotifications(pageId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `WorkshopNotifications/GetNotifications/${pageId}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public DeleteSelectedNotifications(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `WorkshopNotifications/DeleteNotifications`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public DeleteSelectedNotificationsByGuid(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `WorkshopNotifications/DeleteSelectedNotificationsByGuid`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

}
