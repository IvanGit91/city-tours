import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  constructor(private translate: TranslateService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip for specific requests if needed (e.g., to external APIs)
    // if (request.url.includes('external-api.com')) {
    //   return next.handle(request);
    // }

    // Get current language or default to 'it' (Italian)
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'it';

    // Clone the request and add the Accept-Language header
    const modifiedRequest = request.clone({
      headers: request.headers.set('Accept-Language', currentLang)
    });

    return next.handle(modifiedRequest);
  }
}
