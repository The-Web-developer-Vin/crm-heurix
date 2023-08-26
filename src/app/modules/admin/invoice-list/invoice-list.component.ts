import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';

@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'id',
        'invoiceDescription',
        'address',
        'GST',
        'idin',
        'actions',
    ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public pageSize = 10;
    pageLength: any;
    pageNumber = 1;
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService
    ) {}

    ngOnInit(): void {
        this.getData();
    }
    getData() {
        this.paginator.pageSize = this.paginator.pageSize
            ? this.paginator.pageSize
            : 10;
        let pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }`;
        this.adminService.getAllInvoices(pageparams).subscribe((res: any) => {
            this.dataSource = res.data.invoice_users;
            this.pageLength = res.data.total;
            console.log('this.dataSource', this.dataSource);
        });
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    add() {
        const addSales = this.matDialog.open(AddInvoiceComponent, {
            width: '45rem',
            height: '40rem',
        });
        addSales.afterClosed().subscribe((result) => {
            this.getData();
        });
    }
}
