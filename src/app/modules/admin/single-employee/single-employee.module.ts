import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SingleEmployeeComponent } from './single-employee.component';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [SingleEmployeeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
          path: '',
          component: SingleEmployeeComponent,
      },
  ]),
  ]
})
export class SingleEmployeeModule { }
