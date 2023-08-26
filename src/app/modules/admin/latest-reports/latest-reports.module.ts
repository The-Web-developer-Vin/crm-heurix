import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestReportsComponent } from './latest-reports.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectReportsComponent } from './project-reports/project-reports.component';
import { ClientReportsComponent } from './client-reports/client-reports.component';

@NgModule({
    declarations: [LatestReportsComponent, ProjectReportsComponent, ClientReportsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: LatestReportsComponent,
            },
        ]),
        SharedModule,
    ],
})
export class LatestReportsModule {}
