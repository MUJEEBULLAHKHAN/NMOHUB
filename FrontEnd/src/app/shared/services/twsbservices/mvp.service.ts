import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MVPService {
    redirectUrl: any;

    constructor(private http: HttpClient) {
    }


    public VerifyEmailAndCreateMvp(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/verifyEmailAndCreateMvp`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public DashboardCountersByUser(employeeId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MvpProgram/DashboardCountersByUser/` + employeeId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllDashboardCounter(): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MvpProgram/GetAllDashboardCounter/`, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetAllMvpRequests(statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MvpProgram/GetAllMvpRequests?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetMvpRequestsByEmployeeId(employeeId: any, statusId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MvpProgram/employee/` + employeeId + `?statusId=` + statusId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public GetMvpRequestDetails(projectRequestId: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(environment.baseAPIUrl + `MvpProgram/details/` + projectRequestId, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ApproveMvpRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/approve`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectMvpRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/reject`, model, {
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
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/schedule-meeting`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public PitchComplete(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/pitch-complete`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ReviewPitchAndScore(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/review-pitch-and-score`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectIdea(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/reject-idea`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public SendProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/send-proposal`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public AcceptProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/accept-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public RejectProposal(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/reject-proposal/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public UploadPaymentProofdoc(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/upload-payment-proofdoc/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }


    public PaymentReceived(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/payment-received/`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    public ProgramActiveRequest(model: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(environment.baseAPIUrl + `MvpProgram/program-active`, model, {
            headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
            observe: 'response'
        });
    }

    // public SendOTP(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/send-otp`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public CreateProject(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/verifyEmailandcreateProject`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public RegisterEmpAuth(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `EmpAuth/register`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public RegisterVerifyEmail(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `EmpAuth/verifyEmail`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public CustomerLogin(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `EmpAuth/login`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public AllLookups(): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `Common/AllLookups`, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetAllCountries(): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `Country/GetAllCountries`, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetAllProjectRequests(statusId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `ProjectRequest/GetAllProjectRequests?statusId=` + statusId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetProjectRequestsByEmployeeId(employeeId: any, statusId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `ProjectRequest/employee/` + employeeId + `?statusId=` + statusId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetProjectRequestDetailsbyProjectRequestid(projectRequestId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `ProjectRequest/details/` + projectRequestId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetDocumentsByProject(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `Documents/project/` + projectId + `/` + serviceId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public DeleteJobDocument(id: any): Observable<any> {
    //     return this.http.delete<any>(environment.baseAPIUrl + `Documents/DeleteDocument/${id}`);
    // }

    // public ApproveProjectRequest(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/approve`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public RejectProjectRequest(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/reject`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }



    // public CreateNewMeeting(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `Meetings/CreateNewMeeting`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }



    // public ReviewPitchAndScore(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/review-pitch-and-score`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public SendProposal(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/send-proposal`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public RejectIdea(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/reject-idea`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetProjectActivitiesByProject(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `ProjectActivity/projectid/` + projectId + `/` + serviceId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetNotesByProject(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `Notes/project/` + projectId + `/` + serviceId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }



    // public PaymentReceived(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `ProjectRequest/payment-received/`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetAllDashboardCounter(): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `Dashboard/GetAllDashboardCounter/`, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public DashboardCountersByUser(employeeId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `Dashboard/DashboardCountersByUser/` + employeeId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetConfigureValues(): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `ConfigureValue/GetConfigureValues/`, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetProjectStatus(): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `ProjectStatus/`, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }


    // public CreatePaymentActivity(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `PaymentActivity/CreatePaymentActivity/`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetAllPaymentActivityByProjectId(projectId: any, serviceId: any): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `PaymentActivity/project/` + projectId + `/` + serviceId, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public AcceptRejectPayment(model: any): Observable<HttpResponse<any>> {
    //     return this.http.put<any>(environment.baseAPIUrl + `PaymentActivity/verify`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GenerateMeetingSlot(model: any): Observable<HttpResponse<any>> {
    //     return this.http.post<any>(environment.baseAPIUrl + `Meetings/GenerateMeetingSlot`, model, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

    // public GetAllMeetingSlots(): Observable<HttpResponse<any>> {
    //     return this.http.get<any>(environment.baseAPIUrl + `Meetings/GetAllMeetingSlots/`, {
    //         headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
    //         observe: 'response'
    //     });
    // }

}