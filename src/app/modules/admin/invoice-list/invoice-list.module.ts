import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoiceListComponent } from './invoice-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
    declarations: [InvoiceListComponent, AddInvoiceComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: InvoiceListComponent }]),
        SharedModule,
        NgxEditorModule,
    ],
})
export class InvoiceListModule {}
