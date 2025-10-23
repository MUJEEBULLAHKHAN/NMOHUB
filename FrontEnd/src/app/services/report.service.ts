import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}

  exportIncubatorList(statusId: number = 0) {
     const apiUrl = environment.baseAPIUrl + `ProjectRequest/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
   exportMvpProgramList(statusId: number = 0) {
     const apiUrl = environment.baseAPIUrl + `MvpProgram/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
   exportPreAccelaratorProgramList(statusId: number = 0) {
     const apiUrl = environment.baseAPIUrl + `PreAccelerator/export?statusId=${statusId}`;
   
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
   exportForeignEntrepreneurList(statusId: any = 0) {
     const apiUrl = environment.baseAPIUrl + `ForeignEntrepreneur/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
   exportFeasibilityProgramList(statusId: any) {
    const apiUrl = environment.baseAPIUrl + `FeasibilityStudy/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }

   exportMeetingAccessRoomList(statusId: number = 0) {
     const apiUrl = environment.baseAPIUrl + `MeetingAccessRoom/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
  exportVirtualOfficeList(statusId: number = 0) {
     const apiUrl = environment.baseAPIUrl + `ServiceRequest/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
   exportClosedOfficeList(statusId: number = 0) {
    const apiUrl = environment.baseAPIUrl + `ClosedOffice/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
   exportCoWorkingSpaceList(statusId: number = 0) {
    const apiUrl = environment.baseAPIUrl + `CoWorkingSpace/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
   exportCustomizedPackageList(statusId: number = 0) {
    const apiUrl = environment.baseAPIUrl + `CustomePackage/export?statusId=${statusId}`;
    return this.http.get(apiUrl, { responseType: 'blob' });
  }
  
}
