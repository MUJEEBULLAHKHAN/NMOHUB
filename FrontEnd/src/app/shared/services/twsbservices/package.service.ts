import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  redirectUrl: any;

  constructor(private http: HttpClient) {
  }

  public GetAllPackage(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Package/GetAllPackages`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public ViewAllPackages(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Package/ViewAllPackages`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetPackagesByServiceId(serviceId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Package/GetPackagesByServiceId/${serviceId}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public CreatePackage(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `Package`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
  public GetPackageById(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Package/${id}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }
  
  public UpdatePackage(id: number, model: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(environment.baseAPIUrl + `Package/${id}`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public GetAllService(): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.baseAPIUrl + `Service/GetAllServices`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }


}