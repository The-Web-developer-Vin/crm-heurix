/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminService } from 'app/core/admin/admin.service';
import { cloneDeep } from 'lodash';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AddClientComponent } from './add-client/add-client.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
    clients: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'position',
        'name',
        'country',
        'hiredin',
        'paidThrough',

        'dev',
        'digital',
        'createdBy',
        'date',
        'actions',
    ];
    dataSource = new MatTableDataSource<Element>();
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    startYear;
    years: any = [];
    monthName;
    yearNumber;
    currentYearIs: any;
    months = [
        { name: 'January ', val: 1 },
        { name: 'February ', val: 2 },
        { name: 'March ', val: 3 },
        { name: 'April ', val: 4 },
        { name: 'May ', val: 5 },
        { name: 'June ', val: 6 },
        { name: 'July ', val: 7 },
        { name: 'August ', val: 8 },
        { name: 'September ', val: 9 },
        { name: 'October ', val: 10 },
        { name: 'November ', val: 11 },
        { name: 'December ', val: 12 },
    ];
    monthnumber: any;
    getallcoutries: any;
    role: any;
    searchName: any;
    defaultAll: boolean = true;
    categoryName = '';
    clearShow: boolean = false;
    sortValue = 1;
    sort: any = '';
    constructor(
        private matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
        const d = new Date();
        let name = this.months[d.getMonth()];
        //this.monthnumber = d.getMonth() + 1;
        this.monthName = name;
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        if (this.role == 'Admin') {
            this.categoryName = 'dev';
            if (this.displayedColumns.length) {
                this.displayedColumns.pop();
            }
        }
        this.getYears();
        this.getClients();
    }

    getYears() {
        let currentYear = new Date().getFullYear();
        let startYear = 2023;
        while (startYear <= currentYear) {
            this.years.push(startYear++);
        }
        // this.yearNumber = currentYear;
    }
    selectedYear(e: any) {
        this.defaultAll = false;
        this.yearNumber = e;
        this.clearShow = true;
        this.getClients();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    doFilter(value: any) {
        this.searchName = value;
        this.clearShow = true;
        this.getClients();
    }
    getAllClients() {
        this.defaultAll = true;
        this.monthnumber = null;
        this.yearNumber = null;
        this.searchName = null;
        this.getClients();
    }
    getMonthValue(e: any) {
        this.defaultAll = false;
        this.monthnumber = e;
        this.clearShow = true;
        this.getClients();
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getClients();
    }
    getClients() {
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
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
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
        this.adminService.getclients(pageparams).subscribe(
            (res: any) => {
                this.dataSource = res.data[0].data;
                this.pageLength = res.data[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
                console.log('err', err);
            }
        );
    }

    add() {
        const addSales = this.matDialog.open(AddClientComponent, {
            width: '35rem',
        });
        addSales.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getClients();
                }
            }
        });
    }
    edit(editData) {
        const edit = this.matDialog.open(AddClientComponent, {
            width: '35rem',
            data: {
                Data: cloneDeep(editData),
            },
        });

        edit.afterClosed().subscribe((result) => {
            this.getClients();
        });
    }
    deleteClient(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete client',
            message: 'Are you sure you want to Delete this Client?',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log('teg', result);
                let obj = {
                    clientId: id,
                };
                this.adminService.deleteClinet(obj).subscribe(
                    (res: any) => {
                        console.log('res', res);
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });
                        this.getClients();
                    },
                    (err: any) => {
                        this.snackBar.open(err.error.message, 'Close', {
                            duration: 3000,
                            panelClass: ['alert-red'],
                        });
                    }
                );
            }
        });
    }
    onChange(e: any, id: any, type: any) {
        console.log('e', e.checked, id, type);
        let obj;
        if (type == 'dev') {
            obj = {
                id: id,
                develepment: e.checked,
            };
        } else {
            obj = {
                id: id,
                digital_marketing: e.checked,
            };
        }
        console.log('obj', obj);
        this.adminService.updateClientStreamStatus(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.getClients();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
            }
        );
    }
    getCategory(e: any) {
        this.searchName = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.categoryName = e;
        this.getClients();
    }
    getDevClients() {
        this.searchName = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.getClients();
    }
    openSingleClient(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/clients/single?id=${id} `, '_blank');
        });
    }
    clear() {
        this.searchName = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.clearShow = false;

        if (this.role == 'Admin') {
            this.categoryName = 'dev';
        }
        this.getClients();
    }
}
