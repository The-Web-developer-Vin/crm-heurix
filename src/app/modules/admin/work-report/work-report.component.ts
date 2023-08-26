import { DatePipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminService } from 'app/core/admin/admin.service';
import { cloneDeep } from 'lodash';
import { AddWorkReportComponent } from './add-work-report/add-work-report.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableUtil } from 'app/shared/excel/excel';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'DD MMM YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};
@Component({
    selector: 'app-work-report',
    templateUrl: './work-report.component.html',
    styleUrls: ['./work-report.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class WorkReportComponent implements OnInit {
    sortValue = 1;
    range!: FormGroup;
    createclientCallForm!: FormGroup;

    dataSource = new MatTableDataSource<Element>();

    displayedColumns = [
        'position',
        'accountName',
        'clientName',
        'createdAt',
        'time',
        'type',
        'JobRoll',
        'crm',
        'status',
        'actions',
    ];
    years: any = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    sort: any;
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    monthnumber: any;
    monthName;
    yearNumber;

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
    allBiddings: any;

    role: any;
    categoryName = '';

    defaultAll: boolean = true;
    searchName: any;
    clearShow: boolean = true;
    rangeDate: any;

    errorText: boolean = false;
    employee: any;
    person: any;
    reportDate: any;
    constructor(
        private datePipe: DatePipe,
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        const d = new Date();
        this.reportDate = this.datePipe.transform(d, 'yyyy-MM-dd');
        let name = this.months[d.getMonth()];
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
        this.getclientcall();

        this.getBiddingEmp();
    }

    getAll() {
        this.clearShow = false;
        this.reportDate = '';

        this.getclientcall();
    }
    doFilter(value: any) {
        this.searchName = value;
        this.clearShow = true;
        this.getclientcall();
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getclientcall();
    }
    addDailyupdate() {
        const addbidding = this.matDialog.open(AddWorkReportComponent, {
            width: '50rem',
        });
        addbidding.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getclientcall();
                }
            }
        });
    }
    editDailyUpdate(biddingData) {
        const edit = this.matDialog.open(AddWorkReportComponent, {
            width: '50rem',

            data: {
                Data: cloneDeep(biddingData),
            },
        });
        edit.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getclientcall();
                }
            }
        });
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
        // return this.years;
    }

    getCategory(e: any) {
        this.searchName = null;

        this.sort = null;
        this.person = '';
        this.categoryName = e;
        this.clearShow = true;
        this.getclientcall();
    }
    getDev() {
        this.monthnumber = null;
        this.yearNumber = null;
        this.searchName = null;
        this.sort = null;
        this.getclientcall();
    }

    deleteDailyUpdate(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Work Report',
            message: 'Are you sure you want to Delete this Work Report?',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.spinner.show();
                this.adminService.deleteDailyUpdate(id._id).subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });
                        this.getclientcall();
                        this.spinner.hide();
                    },
                    (err: any) => {
                        this.snackBar.open(err.error.message, 'Close', {
                            duration: 3000,
                            panelClass: ['alert-red'],
                        });
                        this.spinner.hide();
                    }
                );
            }
        });
    }
    clear() {
        this.searchName = null;
        this.clearShow = false;
        this.reportDate = '';
        this.person = '';

        if (this.role == 'Admin') {
            this.categoryName = 'dev';
        }
        this.getclientcall();
    }
    exportTable() {
        TableUtil.exportTableToExcel('ReportTable');
    }
    getBiddingEmp() {
        this.adminService.getBiddingEmployees().subscribe((res: any) => {
            this.employee = res.data.employee;
        });
    }
    selectManager(e: any) {
        this.person = e;
        this.categoryName = '';
        this.clearShow = true;
        this.getclientcall();
    }
    selectedDate(e: any) {
        this.reportDate = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        this.clearShow = true;
        this.getclientcall();
    }
    getclientcall() {
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
        if (this.reportDate) {
            pageparams += `&date=${this.reportDate}`;
        }
        if (this.person) {
            pageparams += `&createdBy=${this.person}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getDailyUpdates(pageparams).subscribe(
            (res: any) => {
                this.dataSource = res.data[0].data;
                this.pageLength = res.data[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
}
