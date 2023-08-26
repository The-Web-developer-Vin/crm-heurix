import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { AddClientComponent } from './add-client/add-client.component';

@NgModule({
    declarations: [ClientsComponent, AddClientComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ClientsComponent,
            },
        ]),
        SharedModule,
    ],
})
export class ClientsModule {}
