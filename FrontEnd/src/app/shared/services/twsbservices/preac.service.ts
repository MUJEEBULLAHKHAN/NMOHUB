import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PreacService {
    redirectUrl: any;

    constructor(private http: HttpClient) {
    }


    public SendOTP(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/send-otp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CreateProject(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/verifyEmailAndCreatePreAccelerator`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DashboardCountersByUser(employeeId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `PreAccelerator/DashboardCountersByUser/` + employeeId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllDashboardCounter(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `PreAccelerator/GetAllDashboardCounter/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllPreAcceleratorRequests(statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `PreAccelerator/GetAllPreAcceleratorRequests?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetPreAcceleratorRequestsByEmployeeId(employeeId: any, statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `PreAccelerator/employee/` + employeeId + `?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetPreAcceleratorRequestDetails(projectRequestId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `PreAccelerator/details/` + projectRequestId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApprovePreAcceleratorRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/approve`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectPreAcceleratorRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/reject`, model, {
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

    public ScheduleMeeting(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/schedule-meeting`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PitchComplete(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/pitch-complete`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ReviewPitchAndScore(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/review-pitch-and-score`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectIdea(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/reject-idea`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/send-proposal`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public AcceptProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/accept-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/reject-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public UploadPaymentProofdoc(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/upload-payment-proofdoc/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public PaymentReceived(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/payment-received/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ProgramActiveRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `PreAccelerator/program-active`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


}