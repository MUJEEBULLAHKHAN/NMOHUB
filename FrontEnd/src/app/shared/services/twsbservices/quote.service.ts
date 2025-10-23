import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient) {
  }

  public GetQuoteDetails(jobId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `QuoteClient/GetQuoteDetails/`+jobId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetPartItemsPerJob(jobId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `PartsTracking/GetPartsPerJob/`+jobId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetQuoteItemTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `QuoteClient/GetQuoteItemTypes`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public SaveQuote(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`QuoteClient/SubmitQuoteItems`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetRates(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `WorkshopInsurerRates/GetWorkshopRates`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddRateToQuote(jobId:any,rateId:any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `QuoteClient/ApplyRateToQuote/`+jobId+'/'+rateId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetQuoteItemRecord(quoteItemId:number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `QuoteClient/GetQuoteItemRecord/`+quoteItemId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public SubmitSingleQuoteItem(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`QuoteClient/SubmitSingleQuoteItem`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public DownloadQuote(jobId: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`QuoteClient/DownloadQuote/`+jobId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public LockQuote(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`QuoteClient/ApproveQuote`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public DownloadSupplementaryItems(jobId: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl +`QuoteClient/DownloadAdditionalsViaExternalQuote/`+jobId, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public DeleteQuoteItems(jobId:any,model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`QuoteClient/DeleteQuoteItems/`+jobId, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public AddQuoteItemsToBetterment(jobId:any,model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`QuoteClient/AddQuoteItemsToBetterment/`+jobId, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public RemoveQuoteItemsFromBetterment(jobId:any,model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`QuoteClient/RemoveQuoteItemsFromBetterment/`+jobId, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }


  
}
