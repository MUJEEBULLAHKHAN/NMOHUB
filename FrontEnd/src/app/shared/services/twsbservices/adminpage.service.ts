import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdminPageService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllAdminPages(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `AdminPage/GetAllAdminPages`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateAdminPage(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `AdminPage`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateAdminPage(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`AdminPage/${id}`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
}