import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AvailabilitySlotRequest } from '../../../models/availability-slot-request';
import { environment } from '../../../../environments/environment';

export interface Expert {
  expertID: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  idType: string;
  idNumber: string;
  profilePicture: string;
  experienceYears: number;
  educationDetails: string;
  linkedInProfileURL: string;
  status: string;
  createdAt: string;
  areaOfExpertise: number[];
}

export interface AreaOfExpertise {
  areaOfExpertiseID: number;
  name: string;
  description?: string;
}

export class AreaOfExpertiseModel {
  areaOfExpertiseID!: number;
  
  name!: string;
  description?: string;
}

export interface ForeignPackage {
  id: number;
  packageName: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private registerUrl = environment.baseAPIUrl + 'ExpertHours/register';
  private listUrl = environment.baseAPIUrl + 'ExpertHours/all';
  private rejectUrl = environment.baseAPIUrl + 'ExpertHours/reject';
  private apiUrl = environment.baseAPIUrl + 'ExpertHours/GenerateAvailableSlot';

  constructor(private http: HttpClient) { }

  registerExpert(expert: Expert): Observable<any> {
    const payload = {
      ExpertID: expert.expertID,
      FullName: expert.fullName,
      Email: expert.email,
      PhoneNumber: expert.phoneNumber,
      Nationality: expert.nationality,
      IDType: expert.idType,
      IDNumber: expert.idNumber,
      ProfilePicture: expert.profilePicture,
      ExperienceYears: expert.experienceYears,
      EducationDetails: expert.educationDetails,
      LinkedInProfileURL: expert.linkedInProfileURL,
      Status: expert.status,
      CreatedAt: expert.createdAt,
      AreaOfExpertise: expert.areaOfExpertise
    };
    return this.http.post<any>(this.registerUrl, payload);
  }

  getAllExperts(): Observable<Expert[]> {
    return this.http.get<Expert[]>(this.listUrl);
  }

  getExpertProfile(expertId: number): Observable<Expert> {
    const url = environment.baseAPIUrl + `ExpertHours/profile/${expertId}`;
    return this.http.get<Expert>(url);
  }

  updateExpertProfile(expertId: number, expert: Expert): Observable<any> {
    const url = environment.baseAPIUrl + `ExpertHours/profile/${expertId}`;
    const payload = {
      ExpertID: expert.expertID,
      FullName: expert.fullName,
      Email: expert.email,
      PhoneNumber: expert.phoneNumber,
      Nationality: expert.nationality,
      IDType: expert.idType,
      IDNumber: expert.idNumber,
      ProfilePicture: expert.profilePicture,
      ExperienceYears: expert.experienceYears,
      EducationDetails: expert.educationDetails,
      LinkedInProfileURL: expert.linkedInProfileURL,
      Status: expert.status,
      CreatedAt: expert.createdAt,
      AreaOfExpertise: expert.areaOfExpertise
    };
    return this.http.put<any>(url, payload);
  }

  activateExpert(expertId: number): Observable<any> {
    const url = environment.baseAPIUrl + `ExpertHours/activate/${expertId}`;
    return this.http.post<any>(url, {});
  }

  deactivateExpert(expertId: number): Observable<any> {
    const url = environment.baseAPIUrl + `ExpertHours/deactivate/${expertId}`;
    return this.http.post<any>(url, {});
  }

  rejectExpert(expertId: number, reason: string): Observable<any> {
    const url = `${this.rejectUrl}/${expertId}`;
    return this.http.post<any>(url, { reason });
  }

  getAreasOfExpertise(): Observable<AreaOfExpertise[]> {
    const url = environment.baseAPIUrl + 'ExpertHours/get-areas-of-expertise';
    return this.http.get<AreaOfExpertise[]>(url);
  }
  // Add this to your existing service file or create a new one
  // generateAvailableSlot(slotRequest: any): Observable<any> {
  //   const url = environment.baseAPIUrl + 'ExpertHours/GenerateAvailableSlot';
  //   return this.http.post<any>(url, slotRequest);
  // }

  public CreateExpertise(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/create-expertise`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public UpdateExpertise(model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl + `ExpertHours/update-expertise`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  generateAvailableSlots(slots: AvailabilitySlotRequest[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, slots);
  }

  generateSlotsForExpert(
    expertId: number,
    date: Date,
    timeSlots: string[],
    isPhysical: boolean,
    isVirtual: boolean
  ): Observable<ApiResponse> {
    const formattedDate = this.formatDate(date);
    const slotRequests: AvailabilitySlotRequest[] = timeSlots.map(time => ({
      expertId: expertId,
      slotDate: formattedDate,
      startTime: time,
      isPhysical: isPhysical,
      isVirtual: isVirtual
    }));

    return this.generateAvailableSlots(slotRequests);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getExpertIdByUserIdUrl = environment.baseAPIUrl + 'ExpertHours/get-expertid-by-userid/';

  // ...existing methods...

  getExpertIdByLoggedInUser(): Observable<{ success: boolean, expertId?: number, message?: string }> {
   
     if (localStorage.getItem('userdetails') != null || localStorage.getItem('userdetails') != undefined) {
     const userinfo  = JSON.parse(localStorage.getItem('userdetails') ?? '');
    
   
       const url = `${this.getExpertIdByUserIdUrl}${userinfo.userId}`;
    return this.http.get<{ success: boolean, expertId?: number, message?: string }>(url);
 
  } else{
       return new Observable(observer => {
        observer.next({ success: false, message: 'User ID not found in localStorage.' });
        observer.complete();
      });
  }
  }

}