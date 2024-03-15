import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { LoaderService } from './services/loader.service';

export const interceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const router: Router = inject(Router);
  const loaderService: LoaderService = inject(LoaderService);

  loaderService.showLoader();

  return next(req).pipe(
    tap((evt) => {
      if (evt instanceof HttpResponse) {
        if (evt != null) {
          loaderService.hideLoader();
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      loaderService.hideLoader();
      let errorMsg = '';
      if (error?.error instanceof ErrorEvent) {
        //errorMsg = `Client Error: ${error?.error?.message}`;
      } else {
        //errorMsg = `Server Error Code: ${error?.status}, Message: ${error?.message}`;
      }
      return throwError(() => error);
    })
  );
};
