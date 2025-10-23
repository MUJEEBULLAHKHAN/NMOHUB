import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceApi {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllService(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Service/GetAllServices`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateService(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`Service`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateService(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`Service/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

}