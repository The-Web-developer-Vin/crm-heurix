import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-view-payments',
    templateUrl: './view-payments.component.html',
    styleUrls: ['./view-payments.component.scss'],
})
export class ViewPaymentsComponent implements OnInit {
    displayedColumns: string[] = ['paid_date', 'amount_paid'];
    displayedColumnsBudget: string[] = [
        'month',
        'budget',
        'paidThrough',
        'paidDate',
        'receivedDate',
        'paid',
        'inr',
        'due',
    ];
    viewData: any = this.data;
    dataSource = new MatTableDataSource<Element>();
    dataSourceBudget = new MatTableDataSource<Element>();
    projectId: any;
    milestones: any;
    view: boolean = false;
    budgetData: any = this.data;
    array: any;
    toalAmount: any;
    currency: any;
    amount: any;
    constructor(
        private matDialog: MatDialog,
        private spinner: NgxSpinnerService,
        private adminService: AdminService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {
        if (this.viewData.view == true) {
            console.log('budget', this.budgetData);
            this.view = true;
            if (this.viewData.Data.projectId) {
                this.projectId = this.viewData.Data.projectId;
            } else {
                this.projectId = this.viewData.Data._id;
            }

            this.currency = this.viewData.Data?.country?.currency;
            this.paymentTransactions();
        }
        if (this.budgetData.view == false) {
            this.view = false;

            this.projectId = this.budgetData.Data._id;
            // this.budgetDetails();
            this.getPayments();
        }
    }

    ngOnInit(): void {}
    close() {
        this.matDialog.closeAll();
    }
    paymentTransactions() {
        this.adminService.paymentbyIDMilestones(this.projectId).subscribe(
            (res: any) => {
                this.milestones = res;
                this.amount = res;
                this.dataSource = res.data;
            },
            (err: any) => {
                console.log('err', err);
            }
        );
    }
    budgetDetails() {
        this.spinner.show();
        this.adminService.getBudgetById(this.projectId).subscribe(
            (res: any) => {
                this.dataSource = res.data;
                this.array = res.data;

                this.toalAmount = 0;
                this.array.forEach((element) => {
                    this.toalAmount += element.amount;
                });
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    getPayments() {
        let pageparams;
        this.spinner.show();
        this.adminService.getClientPayments(this.projectId, '').subscribe(
            (res: any) => {
                console.log('res', res);
                this.dataSourceBudget = res.data.getPay;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
}
