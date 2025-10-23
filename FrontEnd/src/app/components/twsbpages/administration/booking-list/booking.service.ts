import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingResponse, ApiResponse, BookingRequest } from './booking';
import { AuthService } from '../../../../shared/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { HttpHeaders, HttpResponse } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.baseAPIUrl + 'ExpertHours/get-all-bookings';
  private apiUrls = environment.baseAPIUrl + 'ExpertHours/book';
  constructor(private http: HttpClient, private authService: AuthService) { }

  // Get all bookings
  // getAllBookings(): Observable<Booking[]> {
  //   return this.http.get<Booking[]>(this.apiUrl);
  // }

  // // Get bookings by expert ID
  // getBookingsByExpertId(expertId: number): Observable<Booking[]> {
  //   const params = new HttpParams().set('expertId', expertId.toString());
  //   return this.http.get<Booking[]>(this.apiUrl, { params });
  // }

  // // Get bookings by customer ID
  // getBookingsByCustomerId(customerId: number): Observable<Booking[]> {
  //   const params = new HttpParams().set('customerId', customerId.toString());
  //   return this.http.get<Booking[]>(this.apiUrl, { params });
  // }

  // // Get bookings with filters (expertId, customerId, or both)
  // getBookingsWithFilters(expertId?: number, customerId?: number): Observable<Booking[]> {
  //   let params = new HttpParams();

  //   if (expertId) {
  //     params = params.set('expertId', expertId.toString());
  //   }

  //   if (customerId) {
  //     params = params.set('customerId', customerId.toString());
  //   }

  //   return this.http.get<Booking[]>(this.apiUrl, { params });
  // }

  // Alternative method that returns the response format with success/message
  getBookingsWithResponse(expertId?: number, customerId?: number): Observable<BookingResponse> {
    let params = new HttpParams();

    if (expertId) {
      params = params.set('expertId', expertId.toString());
    }

    if (customerId) {
      params = params.set('customerId', customerId.toString());
    }

    return this.http.get<BookingResponse>(this.apiUrl, { params });
  }



  createBooking(bookingData: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrls, bookingData);
  }

  createBookingWithResponse(bookingData: BookingRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrls, bookingData);
  }

  getBookingsBasedOnRole(roleid: any, expertId: any, customerId: any): Observable<Booking[]> {
    //return this.getAllBookings();
    //Check user role and call appropriate method
    if (roleid == 10) {
      return this.getAllBookings();
    } else if (roleid == 9) {
      // Assuming expert has employeeId that matches expertId
      // const expertId = roles.employeeId;
      return this.getBookingsByExpertId(expertId);
    } else {
      return this.getBookingsByCustomerId(customerId);
    }
  }

  // Get all bookings (admin only)
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // Get bookings by expert ID
  getBookingsByExpertId(expertId: number): Observable<Booking[]> {
    const params = new HttpParams().set('expertId', expertId.toString());
    return this.http.get<Booking[]>(this.apiUrl, { params });
  }

  // Get bookings by customer ID
  getBookingsByCustomerId(customerId: number): Observable<Booking[]> {
    const params = new HttpParams().set('customerId', customerId.toString());
    return this.http.get<Booking[]>(this.apiUrl, { params });
  }

  // Get bookings with filters (expertId, customerId, or both)
  getBookingsWithFilters(expertId?: number, customerId?: number): Observable<Booking[]> {
    let params = new HttpParams();

    if (expertId) {
      params = params.set('expertId', expertId.toString());
    }

    if (customerId) {
      params = params.set('customerId', customerId.toString());
    }

    return this.http.get<Booking[]>(this.apiUrl, { params });
  }

  public ConfirmBooking(bookingId: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/confirm-booking/${bookingId}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public CancelByUser(bookingId: number, reason: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/cancel-by-user/${bookingId}`, { reason }, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public CancelByExpert(bookingId: number, reason: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/cancel-by-expert/${bookingId}`, { reason }, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public PaymentByUser(bookingId: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/pay/${bookingId}`, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public SessionNote(bookingId: number, notes: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/session-notes/${bookingId}`, { notes }, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public feedback(model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/feedback`, { model }, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }

  public reshedule(bookingId: number, model: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.baseAPIUrl + `ExpertHours/reschedule/${bookingId}`, model, {
      headers: new HttpHeaders({ 'Content-type': 'Application/json' }),
      observe: 'response'
    });
  }




}