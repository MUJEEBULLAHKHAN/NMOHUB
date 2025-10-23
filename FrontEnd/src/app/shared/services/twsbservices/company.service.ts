import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllCompanyType(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `References/CompanyType`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateCompanyBranch(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`Companies`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetCompanyBranchByCompanyId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Companies/CompanyBranch/${id}`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public UpdateCompanyBranch(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl +`Companies/EditCompany`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public CreateBranch(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`Companies/AddNewCompany`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }

  public GetAllCompanyBranch(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Companies`, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
  public UpdateBranch(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl +`Companies/EditCompany`, model, {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
  
  public GetCompanyBranchByBranchId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Companies/GetCompanyById?Id=` + id , {
      headers: new HttpHeaders({'Content-type': 'Application/json'}),
      observe: 'response'
    });
  }
}