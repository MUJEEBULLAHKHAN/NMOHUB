import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactClientService {

    constructor(private http: HttpClient) {
    }
  
   
    public GetClientDetails(jobId: number): Observable<HttpResponse<any>> {
      return this.http.get<any>(environment.baseAPIUrl + `ContactClients/GetCustomerEmailProperties/`+jobId, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }
  

  
    public SendEmailToClient(model: any): Observable<HttpResponse<any>> {
     
      return this.http.post<any>(environment.baseAPIUrl +`ContactClients/EmailClient`, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public SendSmsToClient(model: any): Observable<HttpResponse<any>> {
     
      return this.http.post<any>(environment.baseAPIUrl +`ContactClients/SmsClient`, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public SendWhatsAppToClient(model: any): Observable<HttpResponse<any>> {
     
      return this.http.post<any>(environment.baseAPIUrl +`ContactClients/WhatsAppClient`, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }

    public ValidateWhatsAppConvesationWithCurrentJob(model: any): Observable<HttpResponse<any>> {
     
      return this.http.post<any>(environment.baseAPIUrl +`ContactClients/ValidateWhatsAppConvesationWithCurrentJob`, model, {
        headers: new HttpHeaders({'Content-type': 'Application/json'}),
        observe: 'response'
      });
    }
}
