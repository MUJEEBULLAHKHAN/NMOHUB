import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StatusUpdates } from '../../../models/PostModels/StatusUpdateModel';

@Injectable({
  providedIn: 'root'
})
export class StatusupdatesService {

  constructor(private http: HttpClient) { }

  
  public GetAllDepartmentsByCategoryId(categoryId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `StatusUpdates/GetAllDepartmentsByCategoryId/`+categoryId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetSubDepartmentByDepartmentId(departmentId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `StatusUpdates/GetSubDepartmentsByDepartmentId/`+departmentId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  
  public UpdateStatus(model: StatusUpdates): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`StatusUpdates/UpdateStatus`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddExistingSubDepartmentToDepartment(departmentId:any,activityStatusId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `StatusUpdates/AddExistingSubDepartmentToDepartment/`+departmentId+`/`+activityStatusId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddSubDepartment(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`StatusUpdates/AddSubDepartment`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public RemoveSubDepartment(departmentId:any,activityStatusId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `StatusUpdates/RemoveSubDepartment/`+departmentId+`/`+activityStatusId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
}
