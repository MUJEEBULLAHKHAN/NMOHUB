import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartsTrackingService {

  constructor(private http:HttpClient) { }

   public SubmitPartsAllocation(model: any,jobId:any): Observable<HttpResponse<any>> {
      return this.http.post<any>(environment.baseAPIUrl +`PartsTracking/AllocatePartsToSupplier/`+jobId, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public async GetPartsOrderSheetEmailContent(model: any,jobId:any): Promise<any> {
      try
      {
        const response : HttpResponse<any> = await  firstValueFrom(this.http.post<any>(environment.baseAPIUrl +`PartsTracking/GetPartsOrderSheetEmailContent/`+jobId, model, {
          headers: new HttpHeaders({'Content-type': 'Application/json'}),
          observe: 'response'
        }));
        return response;
       
      }
      catch(error)
      {
        console.error("Error fetching data:", error);
        throw error;
      }
     
    }

    async GetAllmakeAsync(): Promise<any> {
        try {
          const data = await firstValueFrom(this.http.get<any[]>(environment.baseAPIUrl + `References/make`)); // Convert Observable to Promise
          return data;
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error;
        }
      }

    public UnallocateSelectedParts(model: any,jobId:any): Observable<HttpResponse<any>> {
      return this.http.post<any>(environment.baseAPIUrl +`PartsTracking/UnallocatePartsFromSupplier/`+jobId, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public GetUnallocatedParts(jobId: any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`PartsTracking/GetUnallocatedParts/`+jobId);
    }

    public EditPartsTrackingData(model: any,jobId:any): Observable<HttpResponse<any>> {
      return this.http.post<any>(environment.baseAPIUrl +`PartsTracking/EditPartsTrackingData/`+jobId, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public SubmitPartsOrder(model: any,jobId:any): Observable<HttpResponse<any>> {
      return this.http.post<any>(environment.baseAPIUrl +`PartsTracking/SubmitPartsOrder/`+jobId, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public SubmitPartsInvoice(model: any,jobId:any): Observable<HttpResponse<any>> {
      return this.http.post<any>(environment.baseAPIUrl +`PartsTracking/SubmitPartsInvoice/`+jobId, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public SubmitPartsCreditNote(model: any,jobId:any): Observable<HttpResponse<any>> {
      return this.http.post<any>(environment.baseAPIUrl +`PartsTracking/SubmitPartsCreditNote/`+jobId, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public DownloadPartsOrderSheet(jobId: any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`PartsTracking/DownloadPartsOrderSheet/`+jobId);
    }

    public DownloadFinalCostingPDF(jobId: any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`PartsTracking/DownloadFinalCostingPDF/`+jobId);
    }

    public SubmitPartsOrderSheetEmail(model: any): Observable<any>{
      return this.http.post<any>(environment.baseAPIUrl +`PartsTracking/SendEmailWithPartsOrderSheet`, model);
    }

    public SubmitPartStatus(jobId: any,statusId:any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`PartsTracking/UpdatePartStatus/`+jobId+'/'+statusId);
    }

    public LockPartsAssessment(jobId: any,lockStatus:any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`PartsTracking/LockPartsAssessment/`+jobId+'/'+lockStatus);
    }

    public UpdateAbuntex(jobId: any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`AuditexAPI/UpdateAbuntex/`+jobId);
    }

    public UpdatePartPriceDifference(jobId: any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`PartsTracking/UpdatePartPriceDifference/`+jobId);
    }

    public MovePartsToExpenses(jobId: any): Observable<any>{
      return this.http.get<any>(environment.baseAPIUrl +`PartsTracking/MovePartsToExpenses/`+jobId);
    }
  
}
