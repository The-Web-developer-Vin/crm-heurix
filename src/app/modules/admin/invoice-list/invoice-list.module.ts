import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoiceListComponent } from './invoice-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';
import { MatChipsModule } from '@angular/material/chips';
@NgModule({
    declarations: [InvoiceListComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: InvoiceListComponent }]),
        SharedModule,
        NgxEditorModule,
        MatChipsModule,
    ],
})
export class InvoiceListModule {}
