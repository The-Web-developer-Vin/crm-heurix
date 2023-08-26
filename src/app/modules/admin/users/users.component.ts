/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AnimationTriggerNames } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { cloneDeep } from 'lodash';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { UpdateStatusComponent } from './update-status/update-status.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginator2: MatPaginator;
    displayedColumns = [
        'position',
        'image',
        'name',

        // 'email',
        'DOJ',
        'emp_id',
        'role',
        'stream',
        // 'cwork',
        'status',
        'actions',
    ];
    displayedColumns2 = [
        'position',
        'image',
        'name',

        // 'email',
        'DOJ',
        'DOR',
        'emp_id',
        'role',
        'stream',
        // 'cwork',
        'status',
        'actions',
    ];
    dataSource = new MatTableDataSource<Element>();
    dataSourceworking = new MatTableDataSource<Element>();
    public pageSize = 100;
    public pageSize2 = 100;
    pageLength: any;
    pageNumber = 1;
    pageLengthWorking: any;
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

    years: any = [];
    yearNumber;

    monthnumber: any;

    all = true;

    searchWorking: any;
    searchRelieve: any;
    link: any;

    categoryName = 'all';

    role: any;
    baseUrl: any;
    clearShow: boolean = false;

    tabName = 'Working Employees';
    monthNumber: any;
    sortValueWork = 1;
    sortValueRelieve = 1;
    sortWork: any;
    sortRelieve: any;
    count: any;
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private router: Router,
        private spinner: NgxSpinnerService
    ) {}
    ngAfterViewInit() {
        this.baseUrl = environment.imageUrl;
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        this.dataSourceworking.paginator = this.paginator;
        this.dataSource.paginator = this.paginator2;
        if (this.tabName == 'Working Employees') {
            this.getworkingEmployees();
        }
        this.getEmployeeCount();
    }
    ngOnInit(): void {
        this.getYears();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    getYears() {
        let currentYear = new Date().getFullYear();
        let startYear = 2023;
        while (startYear <= currentYear) {
            this.years.push(startYear++);
        }
        // this.yearNumber = currentYear;
    }

    sorting(e: any, value: any) {
        if (this.tabName == 'Working Employees') {
            this.sortWork = value;
            this.getworkingEmployees();
        } else {
            this.sortRelieve = value;
            this.getRelievingEmployees();
        }
    }

    selectedTabChange(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        this.searchRelieve = null;
        this.searchWorking = null;
        if (this.tabName == 'Working Employees') {
            this.getworkingEmployees();
        } else {
            this.getRelievingEmployees();
        }
        setTimeout(() => {
            switch (indexNumber) {
                case 0:
                    this.dataSourceworking.paginator = this.paginator;
                    break;
                case 1:
                    this.dataSource.paginator = this.paginator;
            }
        }, 500);
    }

    generateOffer(id: any, data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/offer-letter/${id}?type=offer `, '_blank');
        });
    }
    generaterelieving(id: any, data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/relieving-letter/${id}?type=relieve `, '_blank');
        });
    }
    generateExpLetter(id: any, data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/experience-letter/${id}?type=experience `, '_blank');
        });
    }
    // working employees

    getworkingEmployees() {
        if (this.sortValueWork == -1) {
            this.sortValueWork = 1;
        } else {
            this.sortValueWork = -1;
        }
        this.pageSize = this.paginator?.pageSize
            ? this.paginator?.pageSize
            : 100;
        this.pageNumber =
            this.paginator.pageIndex + 1 ? this.paginator.pageIndex + 1 : 1;
        let pageparams;
        pageparams = `?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`;
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.searchWorking) {
            pageparams += `&searchKey=${this.searchWorking}`;
        }
        if (this.monthNumber && this.yearNumber) {
            pageparams += `&month=${this.monthNumber}&year=${this.yearNumber}`;
        }
        if (this.sortWork) {
            pageparams += `&sort=${this.sortWork}&sortValue=${this.sortValueWork}`;
        }
        this.spinner.show();
        this.adminService.getWorkingEmployees(pageparams).subscribe(
            (res: any) => {
                this.spinner.hide();
                this.dataSourceworking = res.data[0]?.data;
                this.pageLengthWorking = res.data[0]?.pagination[0]?.total;
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }

    searchWorkingEvent(e: any) {
        this.searchWorking = e;
        this.clearShow = true;
        this.getworkingEmployees();
    }

    clear() {
        this.monthNumber = null;
        this.yearNumber = null;
        this.clearShow = false;
        this.categoryName = 'dev';
        if (this.tabName == 'Working Employees') {
            this.searchWorking = null;
            this.getworkingEmployees();
        } else {
            this.searchRelieve = null;
            this.getRelievingEmployees();
        }
        this.getEmployeeCount();
    }

    // relieving employees
    getRelievingEmployees() {
        if (this.sortValueRelieve == -1) {
            this.sortValueRelieve = 1;
        } else {
            this.sortValueRelieve = -1;
        }
        this.pageSize2 = this.paginator2?.pageSize
            ? this.paginator2?.pageSize
            : 100;
        this.pageNumber =
            this.paginator2.pageIndex + 1 ? this.paginator2.pageIndex + 1 : 1;

        let pageparams;
        pageparams = `?pageSize=${this.pageSize2}&pageNumber=${this.pageNumber}`;
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.searchRelieve) {
            pageparams += `&searchKey=${this.searchRelieve}`;
        }
        if (this.monthNumber && this.yearNumber) {
            pageparams += `&month=${this.monthNumber}&year=${this.yearNumber}`;
        }
        if (this.sortRelieve) {
            pageparams += `&sort=${this.sortRelieve}&sortValue=${this.sortValueRelieve}`;
        }
        this.spinner.show();
        this.adminService.getEmployees(pageparams).subscribe(
            (res: any) => {
                this.dataSource = res.data[0]?.data;
                this.pageLength = res.data[0]?.pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    searchRelievEvent(e: any) {
        this.searchRelieve = e;
        this.clearShow = true;
        this.getRelievingEmployees();
        this.getEmployeeCount();
    }

    addEmployee() {
        const addUser = this.matDialog.open(AddUserComponent, {
            autoFocus: false,
            width: '60rem',
            height: '710px',
        });
        addUser.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    //this.getRelievingEmployees();
                    this.getworkingEmployees();
                    this.getEmployeeCount();
                }
            }
        });
    }
    editEmployee(employeeData) {
        const edit = this.matDialog.open(AddUserComponent, {
            width: '60rem',
            height: '710px',
            data: {
                Data: cloneDeep(employeeData),
            },
        });
        edit.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    if (this.tabName == 'Working Employees') {
                        this.getworkingEmployees();
                    } else {
                        this.getRelievingEmployees();
                    }
                }
            }
        });
    }
    changePassword(user: any) {
        const changePassword = this.matDialog.open(ChangePasswordComponent, {
            autoFocus: false,
            width: '28rem',
            //height: '360px',
            data: {
                Data: cloneDeep(user),
            },
            // data: { id },
        });
        changePassword.afterClosed().subscribe((result) => {});
    }

    // latest changes
    getCategory(e: any) {
        this.categoryName = e;
        if (this.tabName == 'Working Employees') {
            this.getworkingEmployees();
        } else {
            this.getRelievingEmployees();
        }
        this.getEmployeeCount();
    }
    selecteMonth(e: any, values: any) {
        this.monthNumber = e.value;
        this.clearShow = true;
        if (this.tabName == 'Working Employees') {
            this.getworkingEmployees();
        } else {
            this.getRelievingEmployees();
        }
        this.getEmployeeCount();
    }
    selectedYear(e: any) {
        this.yearNumber = e.value;
        this.clearShow = true;
        if (this.tabName == 'Working Employees') {
            this.getworkingEmployees();
        } else {
            this.getRelievingEmployees();
        }
        this.getEmployeeCount();
    }
    singleEmployee(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/employees/single?id=${id} `, '_blank');
        });
    }
    getEmployeeCount() {
        let pageparams;
        pageparams = `?type=${this.categoryName}`;
        if (this.monthNumber && this.yearNumber) {
            pageparams += `&month=${this.monthNumber}&year=${this.yearNumber}`;
        }
        this.adminService
            .getEmployeeCounts(pageparams)
            .subscribe((res: any) => {
                this.count = res.data;
            });
    }
    editStatus(data: any) {
        const addUser = this.matDialog.open(UpdateStatusComponent, {
            width: '35rem',
            height: '400px',
            data: {
                Data: cloneDeep(data),
            },
        });
        addUser.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    if (this.tabName == 'Working Employees') {
                        this.getworkingEmployees();
                    } else {
                        this.getRelievingEmployees();
                    }
                }
            }
        });
    }
}
