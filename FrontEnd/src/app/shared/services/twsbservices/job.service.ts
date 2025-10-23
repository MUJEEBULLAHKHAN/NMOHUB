import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisterWalkInJob } from '../../../models/RegisterNewJob';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient ) { }

  public CreateManualJob(model: RegisterWalkInJob): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`Job/CreateManualJob`, model);
  }

  public CreateSmartQuoteJob(model: RegisterWalkInJob): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`SmartQuoteAPI/UploadSmartQuoteJob`, model);
  }

  public CreateAudatexJob(model: RegisterWalkInJob): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`AuditexAPI/UploadAudatexJob`, model);
  }

  public GetJobOverview(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`JobDetails/GetJobOverview/`+jobId);
  }

  public GetMinimalJobDetails(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`JobDetails/GetMinimalJobDetails/`+jobId);
  }

  public EditJob(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`JobDetails/EditJob`, model);
  }

  public GetTimeLineByJobId(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`JobActivities/GetTimeLineByJobId/`+jobId);
  }

  public GetJobDetails(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`JobDetails/GetJobDetails/`+jobId);
  }

  public UploadDocument(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`UploadDocuments/PostUploadDocument`, model);
  }

  public GetUploadDocumentByJobId(jobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`UploadDocuments/UploadDocument/${jobId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GenerateDocument(jobId: number, documentType: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`UploadDocuments/GenerateDocument/${jobId}/${documentType}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }


  public UploadImage(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`UploadDocuments/PostUploadImages`, model);
  }

  public GetImagesByJobId(jobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`UploadDocuments/Images/${jobId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  public ConvertJobToRepairOrder(jobId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`Job/ConvertJobToRo/`+jobId);
  }

  
  public CreateTask(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`JobTask/JobTask`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllTaskByJobId(jobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`JobTask/JobTask/${jobId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public JobTaskCompleted(JobTaskDetailId: any, IsTaskCompleted: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`JobTask/JobTaskCompleted/${JobTaskDetailId}/${IsTaskCompleted}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public JobSubTaskCompleted(JobTaskQuoteItemId: any, IsTaskCompleted: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`JobTask/JobSubTaskCompleted/${JobTaskQuoteItemId}/${IsTaskCompleted}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public ExportTask(jobId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`JobTask/ExportTask/${jobId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
  public GetAllUnCompletedTechnicianTask(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`JobTask/UnCompletedTechnicianTask`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllSubTask(employeeId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`JobTask/GetAllSubTask/${employeeId}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

    public DeleteJobImages(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`UploadDocuments/DeleteImage/` , model);
  }

    public DeleteJobDocument(jobId: any, documentId: any): Observable<any>{
    return this.http.get<any>(environment.baseAPIUrl +`UploadDocuments/DeleteDocument/${jobId}/${documentId}`);
  }
}
