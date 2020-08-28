import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { ActivatedRoute } from '@angular/router';

import { DepartmentsService } from 'app/main/apps/e-commerce/deparment/departments.service';
import { LinkService } from 'app/main/apps/e-commerce/link/link.service';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
    selector   : 'test-departments',
    templateUrl: './departments.component.html',
    styleUrls  : ['./departments.component.scss'],
    animations : fuseAnimations
})
export class DepartmentsComponent implements OnInit
{
    dataSource: FilesDataSource | null;
    displayedColumns = ['select','Code', 'Name', 'CreateDate', 'Description'];

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
        private activatedRoute: ActivatedRoute,
        private linkService: LinkService,
        private _departmentsService: DepartmentsService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._departmentsService, this.paginator, this.sort);
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
            this.linkService.pokeDepartment(this.selection.selected.length>0?this.selection.selected[this.selection.selected.length - 1]:null);
        })
        let x = this.dataSource.filteredData.find(v=>v.id == this.activatedRoute.snapshot.queryParams.newitem);
        if(x){
            // this.selection.onChange.next(x);
            // console.log(x);
            // this.selection.isSelected(x);
            this.selection.select(x);
        }

    }    
        // this.linkService.pokeDepartment(this.dataSource.filterData[numSelected]);
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
        this.linkService.pokeDepartment(null);
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    constructor(
        private _departmentsService: DepartmentsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._departmentsService.departments;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._departmentsService.onDepartmentChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._departmentsService.departments.slice();

                        data = this.filterData(data);

                        this.filteredData = [...data];

                        data = this.sortData(data);

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
