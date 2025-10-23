import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NMOService {
    redirectUrl: any;

    constructor(private http: HttpClient) {
    }

    public SendOTPForVirtualOffice(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `Package/send-otp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendOTPForCustomPackage(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `CustomePackage/send-otp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendOTPForClosedOffice(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ClosedOffice/send-otp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendOTPForMeetingAccess(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MeetingAccessRoom/send-otp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendOTPForCoWorkingSpace(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `CoWorkingSpace/send-otp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendOTP(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/send-otp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CreateProject(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/verifyEmailandcreateProject`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RegisterEmpAuth(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `EmpAuth/register`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RegisterVerifyEmail(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `EmpAuth/verifyEmail`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CustomerLogin(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `EmpAuth/login`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public AllLookups(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Common/AllLookups`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllCountries(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Country/GetAllCountries`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllProjectRequests(statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ProjectRequest/GetAllProjectRequests?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public GetProjectRequestsByEmployeeId(employeeId: any, statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ProjectRequest/employee/` + employeeId + `?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetProjectRequestDetailsbyProjectRequestid(projectRequestId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ProjectRequest/details/` + projectRequestId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetDocumentsByProject(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Documents/project/` + projectId + `/` + serviceId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DeleteJobDocument(id: any): Observable<any> {
        return this.http.delete<any>(environment.baseAPIUrl + `Documents/DeleteDocument/${id}`);
    }

    public ApproveProjectRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/approve`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectProjectRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/reject`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ScheduleMeeting(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/schedule-meeting`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CreateNewMeeting(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `Meetings/CreateNewMeeting`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PitchComplete(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/pitch-complete`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ReviewPitchAndScore(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/review-pitch-and-score`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/send-proposal`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectIdea(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/reject-idea`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetProjectActivitiesByProject(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ProjectActivity/projectid/` + projectId + `/` + serviceId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetNotesByProject(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Notes/project/` + projectId + `/` + serviceId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public AcceptProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/accept-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/reject-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public UploadPaymentProofdoc(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/upload-payment-proofdoc/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PaymentReceived(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/payment-received/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllDashboardCounter(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Dashboard/GetAllDashboardCounter/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DashboardCountersByUser(employeeId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Dashboard/DashboardCountersByUser/` + employeeId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllServicesRequestDashboardCounterGroupByStatusId(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Dashboard/GetAllServicesRequestDashboardCounterGroupByStatusId/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllServicesRequestDashboardCounterByEmployeeGroupByStatusId(employeeId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Dashboard/GetAllServicesRequestDashboardCounterByEmployeeGroupByStatusId/` + employeeId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllServicesList(statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Dashboard/GetAllServicesList?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllServicesByAdmin(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ServiceRequest/GetAllServicesByAdmin`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    //"GetAllServicesList?statusId=0'"
    public GetAllServiceListByEmployeeId(employeeId: any, statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Dashboard/GetAllServiceListByEmployeeId/` + employeeId + `/?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetConfigureValues(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ConfigureValue/GetConfigureValues/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetProjectStatus(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ProjectStatus/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public CreatePaymentActivity(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PaymentActivity/CreatePaymentActivity/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllPaymentActivityByProjectId(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `PaymentActivity/project/` + projectId + `/` + serviceId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public AcceptRejectPayment(model: any): Observable<HttpResponse<any>> {
        return this.http.put<any>(environment.baseAPIUrl + `PaymentActivity/verify`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GenerateMeetingSlot(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `Meetings/GenerateMeetingSlot`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllMeetingSlots(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Meetings/GetAllMeetingSlots/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ProgramActiveRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/program-active`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllAvailableSlot(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Meetings/GetAllAvailableSlot/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllMeetingAccessRoom(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MeetingAccessRoom/GetAllMeetingAccessRoom/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllMeetingAccessRequest(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MeetingAccessRoom/GetAllMeetingAccessRequest`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllMeetingAccessRequestByEmployeeId(id: number,): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MeetingAccessRoom/GetAllMeetingAccessRequestByEmployeeId/${id}`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public updateMeetingAccessRoom(id: number, model: any): Observable<HttpResponse<any>> {
        return this.http.put<any>(environment.baseAPIUrl + `MeetingAccessRoom/${id}`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CreateMeetingAccessRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MeetingAccessRoom/CreateMeetingAccessRequest`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public CreateClosedOfficeRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ClosedOffice/CreateClosedOfficeRequest`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllClosedOffice(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ClosedOffice/GetAllClosedOffice`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public ClosedOfficeUpdate(id: number, model: any): Observable<HttpResponse<any>> {
        return this.http.put<any>(environment.baseAPIUrl + `ClosedOffice/${id}`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllClosedOfficeRequest(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ClosedOffice/GetAllClosedOfficeRequest`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllClosedOfficeRequestByEmployeeId(id: number,): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ClosedOffice/GetAllClosedOfficeRequestByEmployeeId/${id}`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public GetAllCoWorkingSpace(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `CoWorkingSpace/GetAllCoWorkingSpace`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public CoWorkingSpaceUpdate(id: number, model: any): Observable<HttpResponse<any>> {
        return this.http.put<any>(environment.baseAPIUrl + `CoWorkingSpace/${id}`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public CreateCoWorkingSpaceRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `CoWorkingSpace/CreateCoWorkingSpaceRequest`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public CreateRequestByUser(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ServiceRequest/CreateRequestByUser`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllVOService(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ServiceRequest/GetAllVOService/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetVOServiceById(id: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${environment.baseAPIUrl}ServiceRequest/GetVOServiceById/${id}`, {
            headers: new HttpHeaders({ 'Content-type': 'application/json' }),
            observe: 'response'
        });
    }
    public UpdatePaymentStatus(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ServiceRequest/UpdatePaymentStatus`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
    public UpdateServiceActive(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ServiceRequest/UpdateServiceActive`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetEmployeeIdByProjectId(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Dashboard/FechEmployeeId/` + projectId + `/` + serviceId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllCoWorkingSpaceRequestByEmployeeId(employeeid: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `CoWorkingSpace/GetAllCoWorkingSpaceRequestByEmployeeId/` + employeeid, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllCoWorkingSpaceRequest(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `CoWorkingSpace/GetAllCoWorkingSpaceRequest/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectCoWorkingSpaceRequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `CoWorkingSpace/RejectCoWorkingSpaceRequest/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApproveCoWorkingSpaceRequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `CoWorkingSpace/ApproveCoWorkingSpaceRequest/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectClosedOfficeRequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ClosedOffice/RejectClosedOfficeRequest/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApproveClosedOfficeRequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ClosedOffice/ApproveClosedOfficeRequest/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public UploadDocumentClosedOfficeRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ClosedOffice/UploadDocumentClosedOfficeRequest/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetDocumentsClosedOffice(closedOfficeRequestId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Documents/ClosedOffice/` + closedOfficeRequestId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ActivateCoWorkingSpaceRequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ClosedOffice/ActivateCoWorkingSpaceRequest/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CreateCustomizedPackage(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `CustomePackage/CreateCustomizedPackage`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllcustomizedPackageByEmployeeId(employeeid: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `CustomePackage/GetAllcustomizedPackageByEmployeeId/` + employeeid, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllcustomizedPackage(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `CustomePackage/GetAllcustomizedPackage/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CreateVirtualRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `Package/CreateVirtualRequest`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllPackageRequestRequestByEmployeeId(employeeid: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Package/GetAllPackageRequestRequestByEmployeeId/` + employeeid, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllPackageRequestRequest(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Package/GetAllPackageRequestRequest/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApprovePackageRequestRequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Package/ApprovePackageRequestRequest/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectPackageRequestRequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Package/RejectPackageRequestRequest/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PackageMeetingAccessRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `Package/CreateMeetingAccessRequest`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllPackageMeetingSlots(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `Package/GetAllMeetingSlots/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
}