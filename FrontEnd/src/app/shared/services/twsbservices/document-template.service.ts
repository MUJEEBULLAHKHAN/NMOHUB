import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentTemplateService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllDocumentTemplate(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/DocumentTemplate`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateDocumentTemplate(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`References/DocumentTemplate`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateDocumentTemplate(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`References/DocumentTemplate`, model, {
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

  public GetDocumentTemplateByEmailType(EmailType: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/DocumentTemplateByEmailType/${EmailType}`, {
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