import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColdCallingComponent } from './cold-calling.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AllColdCallingComponent } from './all-cold-calling/all-cold-calling.component';
import { InterestedListComponent } from './interested-list/interested-list.component';
import { NotInterestedListComponent } from './not-interested-list/not-interested-list.component';
import { UpdateCallingStatusComponent } from './update-calling-status/update-calling-status.component';

@NgModule({
    declarations: [ColdCallingComponent, AllColdCallingComponent, InterestedListComponent, NotInterestedListComponent, UpdateCallingStatusComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: ColdCallingComponent,
            },
        ]),
    ],
})
export class ColdCallingModule {}
