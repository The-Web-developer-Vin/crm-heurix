import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalsComponent } from './proposals.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { DevProposalsComponent } from './dev-proposals/dev-proposals.component';
import { DigitalProposalsComponent } from './digital-proposals/digital-proposals.component';

@NgModule({
    declarations: [ProposalsComponent, DevProposalsComponent, DigitalProposalsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProposalsComponent,
            },
        ]),
    ],
})
export class ProposalsModule {}
