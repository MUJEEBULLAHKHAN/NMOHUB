import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiResponse, Expert } from './view-all-expert';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private apiUrl = 'ExpertHours/view-all-experts';

  constructor(private http: HttpClient) { }

  getAllExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>(environment.baseAPIUrl + this.apiUrl);
  }

  getExpertsByStatus(status: string): Observable<Expert[]> {
    return this.http.get<Expert[]>(`${environment.baseAPIUrl + this.apiUrl}?status=${status}`);
  }

  getExpertById(expertId: number): Observable<Expert> {
    return this.http.get<Expert>(`${environment.baseAPIUrl + this.apiUrl}/${expertId}`);
  }
}