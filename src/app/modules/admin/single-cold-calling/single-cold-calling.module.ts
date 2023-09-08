import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleColdCallingComponent } from './single-cold-calling.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SingleColdCallingComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SingleColdCallingComponent,
            },
        ]),
    ],
})
export class SingleColdCallingModule {}
