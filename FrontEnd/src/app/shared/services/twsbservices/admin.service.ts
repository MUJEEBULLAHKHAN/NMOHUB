import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  
  
  public GetAllUsers(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/GetUsers`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetWorkshopUsers(workshopId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/`+workshopId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllWorkshops(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/GetAllWorkshops`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllRoles(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/GetAllRoles`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public Register(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`Administrator/Register`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateUser(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`UserAuth/UpdateUser`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public WorkShopsByUsername(username: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/WorkShopsByUsername?username=`+username, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
}
