import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AddProjectComponent } from './add-project/add-project.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';
import { ViewPaymentsComponent } from './view-payments/view-payments.component';

@NgModule({
    declarations: [
        ProjectsComponent,
        AddProjectComponent,
        EmployeeListComponent,
        ViewPaymentsComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProjectsComponent,
            },
        ]),
        SharedModule,
        MatNativeDateModule,
        MatSortModule,
    ],
})
export class ProjectsModule {}
