import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep, subtract } from 'lodash';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-single-project',
    templateUrl: './single-project.component.html',
    styleUrls: ['./single-project.component.scss'],
})
export class SingleProjectComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'month',
        'budget',
        'paidThrough',
        'paidDate',
        'receivedDate',
        'paid',
        // 'Inr',
        'due',
        'actions',
    ];
    dataSource = new MatTableDataSource<Element>();
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    myDate;
    projectId: any;
    projectData: any;
    projectDetails: any = [];
    employees: any = [];
    filterDate: any;
    defaultAll: boolean = true;
    budgetDetails: any;

    constructor(
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private matDialog: MatDialog,
        private snackBar: MatSnackBar,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.projectId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.getbyProjectid();
        this.getPayments();
        this.myDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    getbyProjectid() {
        const pageparams: any = [];
        this.spinner.show();
        this.adminService.getbyProjectId(this.projectId).subscribe(
            (res: any) => {
                this.projectData = res.data.project;
                this.projectDetails = res.data.project;

                this.employees = this.projectData.employees;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    getPayments() {
        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;
        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }`;
        if (this.filterDate) {
            pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
                this.paginator.pageIndex + 1
            }&date=${this.filterDate}`;
        }
        this.spinner.show();
        this.adminService
            .getClientPayments(this.projectId, pageparams)
            .subscribe(
                (res: any) => {
                    this.budgetDetails = res.data;
                    this.dataSource = res.data.getPay;
                    this.pageLength = res.data?.count;
                    this.spinner.hide();
                },
                (err: any) => {
                    this.spinner.hide();
                }
            );
    }
    addEvent(e: any) {
        this.defaultAll = false;
        this.filterDate = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        this.getPayments();
    }
    getAll() {
        this.filterDate = null;
        this.defaultAll = true;
        this.getPayments();
    }
    editPayment(paymentData) {
        // let toSendData = { paymentData, projectData: this.projectData };
        const addPayment = this.matDialog.open(EditPaymentComponent, {
            width: '50rem',
            //height: '600px',
            data: {
                paymentData: paymentData,
                projectData: this.projectData,
            },
        });
        addPayment.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getPayments();
                }
            }
        });
    }
    deletePayment(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Payment',
            message: 'Are you sure you want to Delete this Payment?',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.spinner.show();
                this.adminService.deletePaymentProject(id).subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });
                        this.spinner.hide();
                        this.getPayments();
                    },
                    (err: any) => {
                        this.snackBar.open(err.error.message, 'Close', {
                            duration: 3000,
                            panelClass: ['alert-red'],
                        });
                        console.log('err', err);
                        this.spinner.hide();
                    }
                );
            }
        });
    }
}
