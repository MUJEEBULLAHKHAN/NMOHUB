import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ForeignEntrepreneurService {
    redirectUrl: any;

    constructor(private http: HttpClient) { }

    public CreateForeignEntrepreneurRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/CreateForeignEntrepreneurRequest`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApproveForeignRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/approve`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectForeignRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/reject`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public MissingInfoForeignRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/missinginfo`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public MissingInfoSubmitedForeignRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/missinginfosubmited`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ScheduleMeeting(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/schedule-meeting`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PitchComplete(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/pitch-complete`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApprovePlan(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/approve-plan`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectPlan(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/reject-plan`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/send-proposal`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public AcceptProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/accept-proposal`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/reject-proposal`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendContract(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/send-contract`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SignedContract(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/signed-contract`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public UploadFullDocuments(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/upload-full-documents`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DocsVerified(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/docs-verified`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PaymentDone(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/payment-done`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ServiceActive(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/service-active`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllProjectRequests(statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/GetAllProjectRequests?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetFERequest(id: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/` + id, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetFERequestsByEmployeeId(employeeId: any, statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/employee/` + employeeId + `?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetFERequestDetailsbyFeId(feId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/details/` + feId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DashboardCountersForAdmin(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/DashboardCountersForAdmin`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DashboardCountersForEmp(employeeId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/DashboardCountersForEmp/` + employeeId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllForeignEntrepreneurRequestListForAdmin(statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/GetAllForeignEntrepreneurRequestListForAdmin?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetForeignEntreprenuerDetalisbyFEid(feId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/GetForeignEntreprenuerDetalisbyFEid/` + feId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ForeignerVerifyEmail(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/ForeignerVerifyEmail`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RegisterandCreateFErequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignEntrepreneur/RegisterandCreateFErequest`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetProjectActivitiesByProject(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignEntrepreneur/` + projectId + '/' + serviceId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllForeignPackages(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `ForeignerPackages/GetAllForeignPackages`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public CreateForeignPackage(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `ForeignerPackages/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public UpdateForeignPackage(id: number, model: any): Observable<HttpResponse<any>> {
        return this.http.put<any>(environment.baseAPIUrl + `ForeignerPackages/${id}`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }
}