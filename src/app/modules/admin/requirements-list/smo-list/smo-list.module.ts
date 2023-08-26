import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoListComponent } from './smo-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SmoListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SmoListComponent,
            },
        ]),
    ],
})
export class SmoListModule {}
