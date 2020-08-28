import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckbox, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { EcommerceDashboardComponent } from 'app/main/apps/e-commerce/dashboard/dashboard.component';
import { EcommerceDashboardService } from 'app/main/apps/e-commerce/dashboard/dashboard.service';
import { EcommerceProductsComponent } from 'app/main/apps/e-commerce/products/products.component';
import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { EcommerceProductComponent } from 'app/main/apps/e-commerce/product/product.component';
import { EcommerceProductService } from 'app/main/apps/e-commerce/product/product.service';
import { EcommerceOrdersComponent } from 'app/main/apps/e-commerce/orders/orders.component';
import { EcommerceOrdersService } from 'app/main/apps/e-commerce/orders/orders.service';
import { EcommerceOrderComponent } from 'app/main/apps/e-commerce/order/order.component';
import { EcommerceOrderService } from 'app/main/apps/e-commerce/order/order.service';
import { DepartmentsComponent } from 'app/main/apps/e-commerce/deparment/departments.component';
import { DepartmentsService } from 'app/main/apps/e-commerce/deparment/departments.service';
import { JobTitlesService } from 'app/main/apps/e-commerce/job-title/job-title.service';
import { DepartmentDetailComponent } from './department-detail/department-detail.component';
import { JobTitleComponent } from './job-title/job-title.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeesService } from './employees/employees.service';
import { DepartmentDetailService } from './department-detail/department.detail.service';
import { JobTitleDetailComponent } from './job-title-detail/job-title-detail.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { JobTitleDetailService } from './job-title-detail/job-title-detail.service';
import { EmployeeDetailService } from './employee-detail/employee-detail.service';

const routes: Routes = [
    {
        path     : 'dashboard',
        component: EcommerceDashboardComponent,
        resolve  : {
            data: EcommerceDashboardService
        }
    },
    {
        path     : 'products',
        component: EcommerceProductsComponent,
        resolve  : {
            data: EcommerceProductsService
        }
    },
    {
        path     : 'products/:id',
        component: EcommerceProductComponent,
        resolve  : {
            data: EcommerceProductService
        }
    },
    {
        path     : 'products/:id/:handle',
        component: EcommerceProductComponent,
        resolve  : {
            data: EcommerceProductService
        }
    },
    {
        path     : 'orders',
        component: EcommerceOrdersComponent,
        resolve  : {
            data: EcommerceOrdersService
        }
    },
    {
        path     : 'orders/:id',
        component: EcommerceOrderComponent,
        resolve  : {
            data: EcommerceOrderService
        }
    },
    {
        path     : 'departments',
        component: DepartmentsComponent,
        resolve  : {
            data: DepartmentsService
        }
    }
    ,
    {
        path     : 'department-detail/:id',
        component: DepartmentDetailComponent,
        resolve  : {
            data: DepartmentDetailService
        }
    },
    {
        path     : 'job-title',
        component: JobTitleComponent,
        resolve  : {
            data: JobTitlesService
        }
    },
    {
        path     : 'job-title-detail/:id',
        component: JobTitleDetailComponent,
        resolve  : {
            data: JobTitleDetailService
        }
    },
    {
        path     : 'employees',
        component: EmployeesComponent,
        resolve  : {
            data: EmployeesService
        }
    },
    {
        path     : 'employee-detail/:id',
        component: EmployeeDetailComponent,
        resolve  : {
            data: EmployeeDetailService
        }
    }
];

@NgModule({
    declarations: [
        EcommerceDashboardComponent,
        EcommerceProductsComponent,
        EcommerceProductComponent,
        EcommerceOrdersComponent,
        EcommerceOrderComponent,
        DepartmentsComponent,
        DepartmentDetailComponent,
        JobTitleComponent,
        EmployeesComponent,
        JobTitleDetailComponent,
        EmployeeDetailComponent
        // LinkComponent,
        // SummaryComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatCheckboxModule,
        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
    ],
    providers   : [
        EcommerceDashboardService,
        EcommerceProductsService,
        EcommerceProductService,
        EcommerceOrdersService,
        EcommerceOrderService,
        DepartmentsService,
        JobTitlesService,
        EmployeesService,
        DepartmentDetailService,
        EmployeeDetailService,
        JobTitleDetailService
    ]
})
export class EcommerceModule
{
}
