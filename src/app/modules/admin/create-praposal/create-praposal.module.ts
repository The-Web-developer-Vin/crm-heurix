import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePraposalComponent } from './create-praposal.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [CreatePraposalComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: CreatePraposalComponent,
            },
        ]),
        SharedModule,
    ],
})
export class CreatePraposalModule {}
