import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-view-budget',
    templateUrl: './view-budget.component.html',
    styleUrls: ['./view-budget.component.scss'],
})
export class ViewBudgetComponent implements OnInit {
    displayedColumnsBudget: string[] = [
        'month',
        'budget',
        'paidThrough',
        'paidDate',
        'receivedDate',
        'paid',
        //'Inr',
        'due',
    ];
    dataSourceBudget = new MatTableDataSource<Element>();
    projectId: any;
    budgetData: any = this.data;
    details: any;
    constructor(
        private matDialog: MatDialog,
        private spinner: NgxSpinnerService,
        private adminService: AdminService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {
        this.projectId = this.budgetData.Data.projectId;
        console.log('budeget', this.budgetData);
        this.getPayments();
    }

    ngOnInit(): void {}
    close() {
        this.matDialog.closeAll();
    }
    getPayments() {
        this.spinner.show();
        this.adminService.getClientPayments(this.projectId, '').subscribe(
            (res: any) => {
                this.dataSourceBudget = res.data.getPay;
                this.details = res.data;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
}
