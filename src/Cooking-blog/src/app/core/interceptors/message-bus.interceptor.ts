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
          const responseMsg = req.headers.getAll('response');
          if (responseMsg) {
            this.toastService.success(responseMsg[0])
          }
        }
      }),
      catchError((err) => {
        this.toastService.error(err.error.description);
        throw err;
      })
    );
  }
}
