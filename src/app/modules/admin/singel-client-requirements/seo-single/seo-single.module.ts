import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoSingleComponent } from './seo-single.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SeoSingleComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SeoSingleComponent,
            },
        ]),
    ],
})
export class SeoSingleModule {}
