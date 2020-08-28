import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from 'app/main/apps/e-commerce/employees/employees.service';
import { LinkService } from 'app/main/apps/e-commerce/link/link.service';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
    selector   : 'test-employees',
    templateUrl: './employees.component.html',
    styleUrls  : ['./employees.component.scss'],
    animations : fuseAnimations
})
export class EmployeesComponent implements OnInit
{
    dataSource: FilesDataSource | null;
    displayedColumns = ['select','Code', 'Name', 'Description'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    public selection = new SelectionModel<any>(true, []);
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private cd: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private linkService: LinkService,
        private _employeesService: EmployeesService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._employeesService, this.paginator, this.sort, this.activatedRoute);
        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if ( !this.dataSource )
                {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });
            this.selection.onChange.subscribe(data =>{
                this.linkService.pokeEmployee(this.selection.selected.length>0?this.selection.selected[this.selection.selected.length - 1]:null);
            })
    }    
    ngAfterViewInit (){
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.filteredData.length;
        
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.filteredData.forEach(row => this.selection.select(row));
    }
    ngOnDestroy() {
        this.linkService.pokeEmployee(null);
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    constructor(
        private _employeesService: EmployeesService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
        private activatedRoute: ActivatedRoute,
    )
    {
        super();

        this.filteredData = this._employeesService.employees;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._employeesService.onEmployeesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange,
            this.activatedRoute.queryParams
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        this.activatedRoute.snapshot.queryParams
                        let data = this._employeesService.employees.slice();

                        data = this.filterData(data);

                        this.filteredData = [...data];

                        data = this.sortData(data);
                        if(this.activatedRoute.snapshot.queryParams.jobtitle){
                            data = data.filter(value=>value.Titles.length > 0).filter(v=>v.Titles.find(v2=>v2.JobTitleCode == this.activatedRoute.snapshot.queryParams.jobtitle));
                        }
                        if(this.activatedRoute.snapshot.queryParams.deparment){
                            data = data.filter(value=>value.Titles.length > 0).filter(v=>v.Titles.find(v2=>v2.DepartmentCode == this.activatedRoute.snapshot.queryParams.deparment));
                            console.log(data);
                        }
                        console.log(data);
                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    }
                ));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._matSort.active )
            {
                case 'Code':
                    [propertyA, propertyB] = [a.Code, b.Code];
                    break;
                case 'Name':
                    [propertyA, propertyB] = [a.Name, b.Name];
                    break;
                case 'CreateDate':
                    [propertyA, propertyB] = [a.CreateDate, b.CreateDate];
                    break;
                case 'Description':
                    [propertyA, propertyB] = [a.Description, b.Description];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
