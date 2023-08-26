import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoListComponent } from './seo-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SeoListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SeoListComponent,
            },
        ]),
    ],
})
export class SeoListModule {}
