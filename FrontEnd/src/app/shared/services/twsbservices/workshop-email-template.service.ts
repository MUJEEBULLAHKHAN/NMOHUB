import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopEmailTemplateService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllWorkshopEmailTemplate(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/WorkshopEmailTemplate`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateWorkshopEmailTemplate(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/WorkshopEmailTemplate`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateWorkshopEmailTemplate(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/WorkshopEmailTemplate`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  // public GetAllEmailType(): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(environment.baseAPIUrl + `References/EmailType`, {
  //     headers: new HttpHeaders({'Content-type': 'Application/json'}),
  //     observe: 'response'
  //   });
  // }

  public GetWorkshopEmailTemplateByEmailType(EmailType: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/WorkshopEmailTemplateByEmailType/${EmailType}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  // public AddType(model: any): Observable<HttpResponse<any>> {
  //   return this.http.post<any>(environment.baseAPIUrl +`References/MessageType`, model, {
  //     headers: new HttpHeaders({'Content-type': 'Application/json'}),
  //     observe: 'response'
  //   });
  // }
  
}