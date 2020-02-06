import { Injectable } from '@angular/core';
import { ICRUDService } from './services';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService implements ICRUDService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  findAll(collectionName: string, queryParams?: string) {
    return this.http.get(`${this.baseUrl}/${collectionName}?${queryParams}`);
  }

  findObject(collectionName: string, id: string | number) {
    return this.http.get(`${this.baseUrl}/${collectionName}/${id}`);
  }

  addNew(collectionName: string, data: any) {
    return this.http.post(`${this.baseUrl}/${collectionName}`, data).toPromise();
  }

  updateObject(collectionName: string, id: string | number, data: any) {
    return this.http.put(`${this.baseUrl}/${collectionName}/${id}`, data).toPromise();
  }

  deleteObject(collectionName: string, id: string | number) {
    return this.http.delete(`${this.baseUrl}/${collectionName}/${id}`).toPromise();
  }
}
