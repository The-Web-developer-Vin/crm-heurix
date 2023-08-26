import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminService } from 'app/core/admin/admin.service';
import { TableUtil } from 'app/shared/excel/excel';
import { NgxSpinnerService } from 'ngx-spinner';
import { cloneDeep } from 'lodash';
import { ViewBudgetComponent } from '../../latest-payments/view-budget/view-budget.component';
import { AddPaymentComponent } from '../../latest-payments/add-payment/add-payment.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-payments-stopped',
    templateUrl: './payments-stopped.component.html',
    styleUrls: ['./payments-stopped.component.scss'],
})
export class PaymentsStoppedComponent implements OnInit {
    @Input() monthNumber;
    @Input() yearNumber;
    @Input() categoryName;
    @Input() monthName;
    @Input() tabName;

    @Input() currencyName;
    @Input('filterDatastopped') filterDatastopped: Subject<any>;
    @Output() _searchValue = new EventEmitter();

    sortValue = 1;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatTable) table: MatTable<any>;
    displayedColumns = [
        'projectName',
        'clientName',
        'projectType',
        'Start',

        // 'paidDate',
        'end',
        //'currency',
        'budget',
        'milstones',
        'paid',
        'due',
        //'reason',
        'status',
        'actions',
    ];

    dataSource = new MatTableDataSource<Element>();
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    sort: any;
    paymentData: any;
    role: any;
    currentStatus: any;
    searchName: any;
    defaultAll: boolean = true;
    selectAllCheckedList: any = [];
    amount;
    clearShow: boolean = false;
    amountValues: any;
    totalShow: boolean = false;
    clientData;
    showDetail: boolean = false;
    selectedClientId: any;
    rowId: any;
    clientDetails: any;
    backShow: boolean = false;
    constructor(
        private matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private adminService: AdminService,
        private changeDetector: ChangeDetectorRef,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        let i = 0;
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;

        this.filterDatastopped.subscribe((e) => {
            this.monthNumber = e.monthNumber;
            this.categoryName = e.categoryName;
            this.yearNumber = e.yearNumber;
            this.tabName = e.tabName;

            this.currencyName = e.currencyName;
            this.getPayments();
            // if (i <= 0) {
            //     i++;
            //     this.getPayments();
            // }
        });

        //if (!i) {
        this.getPayments();
        //}
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    doFilter(value: any) {
        this.searchName = value;
        this.clearShow = true;
        this._searchValue.emit(this.searchName);
        this.getPayments();
    }
    getCheckedValue(e, data, i) {
        if (e.checked == true) {
            if (this.selectAllCheckedList.length != 0) {
                let val = this.selectAllCheckedList.find(
                    (cli) => cli.client_name == data.client_name
                );
                if (val) {
                    this.selectAllCheckedList.push(data);
                } else {
                    //this.dataSource[i].isChecked = false;
                    this.snackBar.open('Please Select Same Client', 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                }
            } else {
                this.selectAllCheckedList.push(data);
            }
        } else {
            let index = this.selectAllCheckedList.indexOf(
                (cli) => cli._id == data._id
            );
            this.selectAllCheckedList.splice(index, 1);
        }
    }

    openSingleProject(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/projects/single?id=${id} `, '_blank');
        });
    }
    openSingleClient(data: any) {
        let id;
        if (data._id?.clientId) {
            id = data._id.clientId;
        } else {
            id = data.client;
        }
        this.router.navigate([]).then((result) => {
            window.open(`/clients/single?id=${id} `, '_blank');
        });
    }
    clear() {
        this.searchName = null;
        this.monthNumber = null;
        this.yearNumber = null;
        this.clearShow = false;
        this.currentStatus = null;
        // if (this.role == 'Admin') {
        //     this.categoryName = 'dev';
        //     // this.monthnumber = null;
        //     // this.yearNumber = null;
        // }
        const d = new Date();
        //let name = this.months[d.getMonth()];
        this.monthName = null;
        this.totalShow = true;
        this.getPayments();
    }
    exportTable() {
        TableUtil.exportTableToExcel('PaymentsTable');
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getPayments();
    }
    getPayments() {
        this.backShow = false;
        this.rowId = undefined;
        if (this.sortValue == -1) {
            this.sortValue = 1;
        } else {
            this.sortValue = -1;
        }

        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;
        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }`;

        if (this.tabName) {
            pageparams += `&status=${this.tabName}`;
        }
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.searchName) {
            pageparams += `&search=${this.searchName}`;
        }
        if (this.monthNumber) {
            pageparams += `&month=${this.monthNumber}`;
        }
        if (this.yearNumber) {
            pageparams += `&year=${this.yearNumber}`;
        }
        if (this.currencyName) {
            pageparams += `&currency=${this.currencyName}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getPayments(pageparams).subscribe(
            (res: any) => {
                this.changeDetector.detectChanges();
                this.paymentData = res.data.payment;
                this.dataSource = res.data.payment;
                this.amount = res.data;
                this.spinner.hide();
                if (res.data.payment.length != 0) {
                    this.paymentData.push({
                        project_budget: res.data.month_budget,
                        amountPaid: res.data.month_paid,
                        due: res.data.month_due,
                        totalProjectBudget: res.data.total_budget,
                        totalPaid: res.data.total_paid,
                        totalDue: res.data.total_due,
                        total: true,
                    });
                }

                this.pageLength = res.data.total?.total;
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    view(editData, type: any) {
        if (editData._id != undefined) {
            const addPayment = this.matDialog.open(AddPaymentComponent, {
                width: '700px',
                // height: '500px',
                panelClass: 'views',
                data: {
                    Data: cloneDeep(editData),
                    view: true,
                },
            });
            addPayment.afterClosed().subscribe((result) => {
                this.getPayments();
            });
        }
    }
    viewBudget(budgetData) {
        if (budgetData._id != undefined) {
            const viewBudget = this.matDialog.open(ViewBudgetComponent, {
                width: '900px',
                height: '600px',
                panelClass: 'views',
                data: {
                    Data: cloneDeep(budgetData),
                },
            });
            viewBudget.afterClosed().subscribe((result) => {});
        }
    }
    toggleDetails(id: any, data: any, i: any) {
        this.clientData = data.project;
        this.backShow = true;
        this.dataSource = data.project;
    }
    back() {
        this.backShow = false;

        this.getPayments();
    }
}
