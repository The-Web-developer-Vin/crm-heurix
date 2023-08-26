import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { WebsiteListComponent } from './website-list.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [WebsiteListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: WebsiteListComponent,
            },
        ]),
    ],
})
export class WebsiteListModule {}
