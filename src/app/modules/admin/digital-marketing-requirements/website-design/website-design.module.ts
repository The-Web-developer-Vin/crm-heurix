import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteDesignComponent } from './website-design.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CommonUploadModalComponent } from './common-upload-modal/common-upload-modal.component';

@NgModule({
    declarations: [WebsiteDesignComponent, CommonUploadModalComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: WebsiteDesignComponent,
            },
        ]),
    ],
})
export class WebsiteDesignModule {}
