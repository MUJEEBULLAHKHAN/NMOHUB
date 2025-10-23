import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StatusUpdates } from '../../../models/PostModels/StatusUpdateModel';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }


  // public GetAllDepartmentsByCategoryId(categoryId:any): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(environment.baseAPIUrl + `StatusUpdates/GetAllDepartmentsByCategoryId/`+categoryId, {
  //     headers: new HttpHeaders({'Content-type': 'Application/json'}),
  //     observe: 'response'
  //   });
  // }

  public GetAllAppointments(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Appointment/Appointments`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }


  public BookAppointment(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Appointment/BookAppointment`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public UpdateBookAppointment(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl + `Appointment/BookAppointment`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetAllCompletionSchedule(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Appointment/CompletionSchedule`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public UpdateScheduledCompletionDate(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Appointment/ScheduledCompletionDate`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

}