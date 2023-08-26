import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoComponent } from './smo.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SmoComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SmoComponent,
            },
        ]),
    ],
})
export class SmoModule {}
