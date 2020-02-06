import { Injectable } from '@angular/core';
import { StoreService } from '../store.service';
import { HttpHelperService } from '../http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends StoreService<any> {
  constructor(private service: HttpHelperService) {
    super(service, 'events');
  }
}
