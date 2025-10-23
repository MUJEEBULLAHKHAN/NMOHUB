import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FeasService {
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
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/verifyEmailAndCreateFeasibility`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DashboardCountersByUser(employeeId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `FeasibilityStudy/DashboardCountersByUser/` + employeeId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllDashboardCounter(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `FeasibilityStudy/GetAllDashboardCounter/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllFeasibilityRequests(statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `FeasibilityStudy/GetAllFeasibilityRequests?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetFeasibilityRequestsByEmployeeId(employeeId: any, statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `FeasibilityStudy/employee/` + employeeId + `?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetFeasibilityRequestDetails(projectRequestId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `FeasibilityStudy/details/` + projectRequestId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApproveFeasibilityRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/approve`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectFeasibilityRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/reject`, model, {
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
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/schedule-meeting`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PitchComplete(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/pitch-complete`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ReviewPitchAndScore(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/review-pitch-and-score`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectIdea(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/reject-idea`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/send-proposal`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public AcceptProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/accept-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/reject-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public UploadPaymentProofdoc(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/upload-payment-proofdoc/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public PaymentReceived(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/payment-received/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ProgramActiveRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `FeasibilityStudy/program-active`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


}