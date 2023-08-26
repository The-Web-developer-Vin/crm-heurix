import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';

import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddTraineeComponent } from '../add-trainee/add-trainee.component';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { EditStatusComponent } from '../edit-status/edit-status.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-completed',
    templateUrl: './completed.component.html',
    styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit {
    defaultAll: boolean = true;
    @Input('filterDataComp') filterDataComp: Subject<any>;
    @Input() monthnumber;
    @Input() yearNumber;
    @Input() tabName;

    searchName;

    statusTrainee = 'onGoing';

    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'position',
        'image',
        'name',
        'DOJ',
        'phone',
        'course',
        'fee',
        'paid',
        'due',
        'reference',
        // 'status',
        'actions',
    ];
    pageLength: any;
    pageLengthCompleted: any;
    pageNumber = 1;
    public pageSize = 100;

    baseUrl: any;
    clearShow: boolean = false;
    sortValue = 1;
    sort: any;
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.baseUrl = environment.imageUrl;
        this.filterDataComp.subscribe((e) => {
            this.monthnumber = e.monthnumber;
            this.yearNumber = e.yearNumber;
            this.tabName = e.tabName;
            this.getAllTrainees();
        });
        this.getAllTrainees();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    doFilter(value: any) {
        this.searchName = value;
        this.clearShow = true;
        this.getAllTrainees();
    }

    addPayment(data: any) {
        const addUser = this.matDialog.open(AddPaymentComponent, {
            //autoFocus: false,
            width: '40rem',
            //height: '600px',
            data: {
                Data: cloneDeep(data),
            },
        });
        addUser.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getAllTrainees();
                }
            }
        });
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getAllTrainees();
    }
    getAllTrainees() {
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
        }&status=completed`;
        if (this.searchName) {
            pageparams += `&searchKey=${this.searchName}`;
        }
        if (this.monthnumber && this.yearNumber) {
            pageparams += `&month=${this.monthnumber}&year=${this.yearNumber}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getAllTrainees(pageparams).subscribe(
            (res: any) => {
                this.dataSource = res.data[0].data;
                this.pageLength = res.data[0]?.pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    getTrainees(e: any) {
        this.statusTrainee = e;
        this.getAllTrainees();
    }
    getOngoing() {
        this.searchName = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.getAllTrainees();
    }
    editTrainee(data: any) {
        const addUser = this.matDialog.open(AddTraineeComponent, {
            autoFocus: false,
            width: '50rem',
            height: '724px',
            data: {
                Data: cloneDeep(data),
            },
        });
        addUser.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getAllTrainees();
                }
            }
        });
    }
    generateCertificate(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/trainees/certificate?id=${id}`, '_blank');
        });
    }
    clear() {
        this.searchName = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.clearShow = false;

        this.getAllTrainees();
    }
    singleTrainee(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/trainees/single?id=${id} `, '_blank');
        });
    }
    editStatus(data: any) {
        console.log('data', data);
        const addUser = this.matDialog.open(EditStatusComponent, {
            width: '35rem',
            height: '350px',
            data: {
                Data: cloneDeep(data),
            },
        });
        addUser.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getAllTrainees();
                }
            }
        });
    }
}
