import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsListComponent } from './leads-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ProspectListComponent } from './prospect-list/prospect-list.component';
import { LeadTabListComponent } from './lead-tab-list/lead-tab-list.component';
import { OpportunityListComponent } from './opportunity-list/opportunity-list.component';
import { CloseListComponent } from './close-list/close-list.component';
import { DeletedListComponent } from './deleted-list/deleted-list.component';
import { UpdateLeadStatusComponent } from './update-lead-status/update-lead-status.component';

@NgModule({
    declarations: [LeadsListComponent, ProspectListComponent, LeadTabListComponent, OpportunityListComponent, CloseListComponent, DeletedListComponent, UpdateLeadStatusComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: LeadsListComponent,
            },
        ]),
    ],
})
export class LeadsListModule {}
