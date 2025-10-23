import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopCourtesyCarsService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllWorkShopCourtesyCars(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `WorkShopCourtesyCars`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddWorkShopCourtesyCars(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`WorkShopCourtesyCars`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateWorkShopCourtesyCars(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`WorkShopCourtesyCars/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public RemoveCourtesyCars(id: any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(environment.baseAPIUrl + `WorkShopCourtesyCars/RemoveCourtesyCars/${id}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddCourtesyCarLog(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`CourtesyCarLogs/CourtesyCarLog`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetCourtesyCarLogByCourtesyCarId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `CourtesyCarLogs/CourtesyCarLogCarId/${id}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddExpireCourtesyCarLog(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`CourtesyCarLogs/AddExpireCourtesyCarLog`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetCourtesyCarLogByJobId(jobId: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`CourtesyCarLogs/GetCourtesyCarLogByJobId/${jobId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
}