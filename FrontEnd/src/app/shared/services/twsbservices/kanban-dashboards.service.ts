import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KanbanDashboardsService {

  constructor(private http:HttpClient) { }

    public GetPartsKanbanDashboard(): Observable<any>{
        return this.http.get<any>(environment.baseAPIUrl +`KanbanDashboards/GetPartsDashboard`);
      }
}
