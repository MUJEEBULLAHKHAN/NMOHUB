import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopnamechangeService {

  private workshopNameSubject = new BehaviorSubject<any>('');

  value$ = this.workshopNameSubject.asObservable();

  private workshopIdSubject = new BehaviorSubject<any>('');

  workshopId$ = this.workshopIdSubject.asObservable();

  setWorkshopName(value:any, workshopId: any)
  {
    this.workshopNameSubject.next(value);

    this.workshopIdSubject.next(workshopId);
  }

  constructor() { }
}
