import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinglePraposalViewComponent } from './single-praposal-view.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [SinglePraposalViewComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SinglePraposalViewComponent,
            },
        ]),
        SharedModule,
    ],
})
export class SinglePraposalViewModule {}
