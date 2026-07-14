import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessageBusInterceptor implements HttpInterceptor {
  constructor(public toastService: ToastrService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const responseMsg = event.headers.getAll('response');
          if (responseMsg) {
            // Only show success toast for 2xx status codes
            if (event.status >= 200 && event.status < 300) {
              this.toastService.success(responseMsg[0]);
            } else if (event.status >= 400) {
              // Show error toast for 4xx and 5xx status codes
              this.toastService.error(responseMsg[0]);
            }
          }
        }
      }),
      catchError((err) => {
        this.toastService.error(err?.error?.description || err?.message || 'An error occurred');
        throw err;
      })
    );
  }
}
