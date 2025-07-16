import { HttpInterceptorFn } from '@angular/common/http';
import { BusyService } from '../services/busy-service';
import { inject } from '@angular/core/primitives/di';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, any>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  if (req.method === 'GET' && cache.has(req.url)) {
    const cachedResponse = cache.get(req.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap({
      next: (event) => {
        if (req.method === 'GET') {
          cache.set(req.url, event);
        }
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    }),
    finalize(() => {
      busyService.idle();
    })
  );
};
