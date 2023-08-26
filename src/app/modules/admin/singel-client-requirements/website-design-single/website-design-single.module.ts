import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteDesignSingleComponent } from './website-design-single.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [WebsiteDesignSingleComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: WebsiteDesignSingleComponent,
            },
        ]),
    ],
})
export class WebsiteDesignSingleModule {}
