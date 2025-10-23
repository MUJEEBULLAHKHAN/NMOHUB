import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyAvailabilitySlotRequest, ApiResponse, ExpertAvailability, AvailabilityResponse } from './model';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = environment.baseAPIUrl + `ExpertHours/GenerateDayWiseAvailableSlots`;
  private baseUrl = environment.baseAPIUrl + `ExpertHours/availability-slots`;

  constructor(private http: HttpClient) { }

  generateDayWiseSlots(requests: any): Observable<ExpertAvailability[]> {
    return this.http.post<ExpertAvailability[]>(this.apiUrl, requests);
  }

  generateSlotsForExpert(
    expertId: number,
    slotDate: Date,
    timeSlots: string[],
    isPhysical: boolean,
    isVirtual: boolean
  ): Observable<ExpertAvailability[]> {
    const formattedDate = this.formatDate(slotDate);

    const request: DailyAvailabilitySlotRequest[] = [{
      expertId: expertId,
      slotDate: formattedDate,
      createdDate: formattedDate,
      isPhysical: isPhysical,
      isVirtual: isVirtual,
      timeSlots: timeSlots.map(time => ({ startTime: time + ':00' }))
    }];

    return this.generateDayWiseSlots(request);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getAvailabilitySlotsByExpertId(expertId: number): Observable<ExpertAvailability[]> {
    return this.http.get<ExpertAvailability[]>(`${this.baseUrl}/${expertId}`);
  }

  // Add this method if you want to handle the response format with success/message
  // getAvailabilitySlotsByExpertIdWithResponse(expertId: number): Observable<AvailabilityResponse> {
  //   return this.http.get<AvailabilityResponse>(`${this.baseUrl}/${expertId}`);
  // }
  getAvailableSlotsByExpertId(expertId: number): Observable<ExpertAvailability[]> {
    return this.http.get<ExpertAvailability[]>(`${this.baseUrl}/${expertId}?status=Available`);
  }
}