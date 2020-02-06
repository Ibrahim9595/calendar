import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { ICRUDService } from './services';
import { map } from 'rxjs/operators';

interface Respose<T> {
  data: T[]
}

export class StoreService<T> {
  stateSubject: BehaviorSubject<T[]>;
  selectedSubject: BehaviorSubject<T> = new BehaviorSubject(null);
  filteredState: Observable<T[]>;
  totalRecords: number = null;
  currentPageNumber: number = null;
  lastPage: number = null;
  private collectionName: string;
  private filterSubject: BehaviorSubject<Object> = new BehaviorSubject([]);

  constructor(
    private crudService: ICRUDService,
    collectionName: string
  ) {
    this.stateSubject = new BehaviorSubject<T[]>(null);
    this.collectionName = collectionName;
    this.filteredState = combineLatest(this.stateSubject, this.filterSubject).pipe(
      map(([state, filters]) =>
        state ? state.filter(s => {
          for (let i in filters) {
            if (filters[i] != s[i]) return false;
          }
          return true;
        }) : []
      ));
  }

  get state(): T[] {
    return this.stateSubject.value ? this.stateSubject.value : [];
  }

  setFilters(filters: Object) {
    this.filterSubject.next(filters);
  }

  find(queryParams = '') {
    return this.crudService.findAll(this.collectionName, queryParams).toPromise()
      .then((d: Respose<T>) => {
        console.log(d);
        this.stateSubject.next(d.data);
      });
  }

  findOne(id: string | number) {
    const ret = this.state.find((el: any) => el.id == id);
    if (ret) {
      this.selectedSubject.next(ret);
      return new Promise(res => res());
    } else {
      return this.crudService.findObject(this.collectionName, id).toPromise()
        .then(d => {
          this.stateSubject.next([...this.state, d.data]);
          this.selectedSubject.next(d.data);
        })
    }
  }

  create(data: T) {
    return this.crudService.addNew(this.collectionName, data)
      .then(d => this.stateSubject.next([d.data, ...this.state]));
  }

  update(id: string | number, data: T) {
    return this.crudService.updateObject(this.collectionName, id, data).then(d => {
      const el = this.state.findIndex((it: any) => it.id === id);
      const temp = this.state.slice(0);
      temp[el] = { ...temp[el], ...data };
      this.stateSubject.next(temp);
    });
  }

  delete(id: string | number) {
    return this.crudService.deleteObject(this.collectionName, id).then(d => {
      let temp = this.state.slice(0);
      temp.splice(temp.findIndex((it: any) => it.id === id), 1);
      this.stateSubject.next(temp);
    });
  }
}
