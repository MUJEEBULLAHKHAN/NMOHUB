import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateDocumentTemplatesService {

  constructor(private http: HttpClient ) { }


  public GenerateQuotationEmail(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`GenerateDocumentTemplate/GenerateQuotationEmail/` , model);
  }

  public SubmitQuotationEmail(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`GenerateDocumentTemplate/SubmitQuotationEmail`, model);
  }

  public GenerateInvoiceEmailContent(model: any): Observable<any>{
    return this.http.post<any>(environment.baseAPIUrl +`GenerateDocumentTemplate/GenerateInvoiceEmail/` , model);
  }
}