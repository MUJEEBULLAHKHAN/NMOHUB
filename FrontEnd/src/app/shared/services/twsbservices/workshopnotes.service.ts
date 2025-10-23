import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopNotesService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public PostWorkshopNotes(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `WorkshopNotes`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetWorkshopNotes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `WorkshopNotes`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetWorkshopNotesByJobId(JobId: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `WorkshopNotes/Notes/${JobId}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public UpdateWorkshopNotes(id: any, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl + `WorkshopNotes/${id}`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
  
}