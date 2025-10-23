import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Newsletter } from '../../../models/newsletterModel';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.baseAPIUrl}newsletters`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(model: Newsletter): Observable<any> {
    return this.http.post(this.apiUrl, model);
  }

  update(id: number, model: Newsletter): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, model);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
