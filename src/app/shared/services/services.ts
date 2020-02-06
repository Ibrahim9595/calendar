import { Observable } from 'rxjs';

export interface ICRUDService {
    findAll(collectionName: string, queryParams?: string): Observable<any>;

    findObject(collectionName: string, id: string | number): Observable<any>;

    addNew(collectionName: string, data: any): Promise<any>;

    updateObject(collectionName: string, id: string | number, data: any): Promise<any>;

    deleteObject(collectionName: string, id: string | number): Promise<any>;
}
