import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SingleClientComponent } from './single-client.component';
import { SharedModule } from 'app/shared/shared.module';
import { ViewMilestonesComponent } from './view-milestones/view-milestones.component';

@NgModule({
    declarations: [SingleClientComponent, ViewMilestonesComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SingleClientComponent,
            },
        ]),
        SharedModule,
    ],
})
export class SingleClientModule {}
