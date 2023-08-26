import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkReportComponent } from './work-report.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AddWorkReportComponent } from './add-work-report/add-work-report.component';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [WorkReportComponent, AddWorkReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
          path: '',
          component: WorkReportComponent,
      },
  ]),
  SharedModule,
  MatSortModule,
  ]
})
export class WorkReportModule { }
