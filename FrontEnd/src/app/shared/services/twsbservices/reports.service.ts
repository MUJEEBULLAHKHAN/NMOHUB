import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) {
  }
  

  public GetCsiCompanies(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Csi/GetCsiCompanies`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetMasterCsiSubmissions(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Csi/GetMasterCsiSubmissions`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetMasterCsiSubmissionsTodaysCount(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Csi/GetMasterCsiSubmissionsTodaysCount`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetCsiSubmittedBatchRows(batchId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Csi/GetCsiSubmittedBatchRows/`+batchId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetFilteredJobsByDateAndDepartment(model: any): Observable<HttpResponse<any>> {

    return this.http.post<any>(environment.baseAPIUrl + `Csi/GetAndFilterCsiJobsToSubmit`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public PostSelectedJobsToCsiEntity(model: any): Observable<HttpResponse<any>> {

    return this.http.post<any>(environment.baseAPIUrl + `Csi/PostSelectedJobsToCsiEntity`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetCsiCompaniesAndApprovedManufacturers(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Csi/GetCsiCompaniesAndApprovedManufacturers/`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddVehicleManufacturerToCsiEntity(model: any): Observable<HttpResponse<any>> {

    return this.http.post<any>(environment.baseAPIUrl + `Csi/AddVehicleManufacturerToCsiEntity`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

    public RemoveManufacturerFromCsiEntity(csiEntityId:any,manufacturerId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Csi/RemoveManufacturerFromCsiEntity/`+csiEntityId+'/'+manufacturerId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
}
