import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopRatesService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllGetWorkshopRates(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `WorkshopInsurerRates/GetWorkshopRates`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddRate(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`WorkshopInsurerRates/AddRate`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllCompanyBranch(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Companies`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
  public UpdatRate(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`WorkshopInsurerRates/UpdatRate`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
}