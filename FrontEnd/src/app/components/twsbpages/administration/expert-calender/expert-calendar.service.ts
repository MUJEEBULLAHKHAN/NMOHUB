import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpertCalendarSlot,CalendarResponse } from './expert-calendar';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExpertCalendarService {
  private apiUrl = environment.baseAPIUrl + 'ExpertHours/mycalender';

  constructor(private http: HttpClient) { }

  getExpertCalendar(expertId: number): Observable<ExpertCalendarSlot[]> {
    return this.http.get<ExpertCalendarSlot[]>(`${this.apiUrl}/${expertId}`);
  }

  getExpertCalendarWithResponse(expertId: number): Observable<CalendarResponse> {
    return this.http.get<CalendarResponse>(`${this.apiUrl}/${expertId}`);
  }
}