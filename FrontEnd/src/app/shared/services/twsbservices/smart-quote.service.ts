import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmartQuoteService {

  constructor(private http: HttpClient) { }

    public GetSmartQuoteAssessment(model: any): Observable<HttpResponse<any>> {
      return this.http.post<any>(environment.baseAPIUrl + `SmartQuoteAPI/SmartQuoteClaimSearch`, model, {
        headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
        observe: 'response'
      });
    }

      public DownloadSmartQuoteAdditionals(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Search/GetJobCounts`, {
          headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
          observe: 'response'
        });
      }
}
