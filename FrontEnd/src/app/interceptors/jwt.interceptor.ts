import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${getToken()}`,
        XTenantId: getConnectionString()        //`taufiq30092024070006`
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['auth/login']);
        }

        return throwError(() => error);
      })
    );
  }
}

function getToken() {
  if (localStorage.getItem('token')) {
    const _userDetails = JSON.parse(localStorage.getItem('token') || '{}'); // JSON.parse(localStorage.getItem('token')| '{}');
    return _userDetails;
  }
  return "null";
}

function getConnectionString() {
  if (localStorage.getItem('workshop')) {
    const userdetails = JSON.parse( localStorage.getItem('workshop') as string)
    if(userdetails != null && userdetails != undefined)
    {
      let _workshopId = userdetails.workshopId.toString();
      return _workshopId;
    }
    else
    {
      return "";
    }
   
  }
  else
  {
    return "";
  }
  
}

