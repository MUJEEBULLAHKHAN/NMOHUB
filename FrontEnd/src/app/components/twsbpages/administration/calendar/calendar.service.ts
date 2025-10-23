import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent, CalendarResponse } from './calendar';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = environment.baseAPIUrl + 'ExpertHours/mycalender';

  constructor(private http: HttpClient) { }

  getExpertCalendar(expertId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/${expertId}`);
  }

  getExpertCalendarWithResponse(expertId: number): Observable<CalendarResponse> {
    return this.http.get<CalendarResponse>(`${this.apiUrl}/${expertId}`);
  }

  getExpertCalendarByDateRange(expertId: number, startDate: string, endDate: string): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/${expertId}?startDate=${startDate}&endDate=${endDate}`);
  }
}