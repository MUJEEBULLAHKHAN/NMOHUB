import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AudatexTokenModel } from '../../../models/AudatexTokenModel';

@Injectable({
  providedIn: 'root'
})
export class AudatexService {

 constructor(private http: HttpClient) { }
 
     public GetAudatexAssessment(model: any): Observable<HttpResponse<any>> {
       return this.http.post<any>(environment.baseAPIUrl + `AuditexAPI/SearchV2`, model, {
         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
         observe: 'response'
       });
     }
 
       public DownloadAudatexAdditionals(): Observable<HttpResponse<any>> {
         return this.http.get<any>(environment.baseAPIUrl + `Search/GetJobCounts`, {
           headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
           observe: 'response'
         });
       }

       public SetAuthToken(model: AudatexTokenModel): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `AuditexAPI/SetAuthDetails`, model, {
          headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
          observe: 'response'
        });
      }
 }
 