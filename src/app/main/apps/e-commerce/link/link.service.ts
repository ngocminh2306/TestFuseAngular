import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  selectedDepartment: Subject<any>;
  selectedJobTitles: Subject<any>;
  selectedEmployee: Subject<any>;
  constructor() {
    this.selectedDepartment = new Subject();
    this.selectedJobTitles = new Subject();
    this.selectedEmployee = new Subject();
   }

  public pokeDepartment(department: any){
    this.selectedDepartment.next(department);
  }
  public loadDepartment(): Observable<any>{
    return this.selectedDepartment.asObservable();
  }
  public pokeJobTitles(JobTitles: any){
    this.selectedJobTitles.next(JobTitles);
  }
  public loadJobTitles(): Observable<any>{
    return this.selectedJobTitles.asObservable();
  }
  public loadEmployee() {
    return this.selectedEmployee.asObservable();
  }
  public pokeEmployee(Employee) {
    this.selectedEmployee.next(Employee);
  }
}