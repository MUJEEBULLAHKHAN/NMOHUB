import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

 
  public GetAllUsers(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/GetUsers`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  // public GetWorkshopUsers(workshopId: number): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(environment.baseAPIUrl + `Administrator/`+workshopId, {
  //     headers: new HttpHeaders({'Content-type': 'Application/json'}),
  //     observe: 'response'
  //   });
  // }

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
    return this.http.post<any>(environment.baseAPIUrl +`Administrator/UpdateUser`, model, {
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

  public RemoveUserFromWorkshop(workshopId: string,userId:string): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/RemoveUserFromWorkshop/`+workshopId+`/`+userId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public ReActivateUserAtWorkshop(workshopId: string,userId:string): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/ReActivateUserAtWorkshop/`+workshopId+`/`+userId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddUserToNewWorkshop(workshopId: string,userId:string): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Administrator/AddUserToNewWorkshop/`+workshopId+`/`+userId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public EnableDisableUser(employeeId: string,isEnable:boolean): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `UserAuth/EnableDisableUser/${employeeId}/${isEnable}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetWorkshopById(id: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Workshops/${id}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
}