import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { AddTraineeComponent } from './add-trainee/add-trainee.component';
import { AddPaymentComponent } from '../trainee/add-payment/add-payment.component';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-trainee',
    templateUrl: './trainee.component.html',
    styleUrls: ['./trainee.component.scss'],
})
export class TraineeComponent implements OnInit {
    defaultAll: boolean = true;
    monthnumber;
    yearNumber;
    searchName;
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
    tabName = 'on-Going';
    allList: Subject<any> = new Subject();
    counts: any;
    filterData: Subject<any> = new Subject();
    filterDataComp: Subject<any> = new Subject();
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
        let currentYear = new Date().getFullYear();
        let startYear = 2023;
        while (startYear <= currentYear) {
            this.years.push(startYear++);
        }
    }

    ngOnInit(): void {
        this.traineeCount();
        if (this.tabName == 'on-Going') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Completed') {
            this.filterDataComp.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (this.tabName == 'on-Going') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Completed') {
            this.filterDataComp.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
    }
    addTrainee() {
        const addUser = this.matDialog.open(AddTraineeComponent, {
            autoFocus: false,
            width: '53rem',
            height: '730px',
            panelClass: 'new-design',
        });
        addUser.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.allList.next(true);
                    this.traineeCount();
                }
            }
        });
    }
    // editTrainee(e: any) {}
    traineeCount() {
        let pageparams;
        if (this.monthnumber && this.yearNumber) {
            pageparams = `?month=${this.monthnumber}&year=${this.yearNumber}`;
        }
        this.adminService
            .getAllTraineeCount(pageparams)
            .subscribe((res: any) => {
                this.counts = res.data;
            });
    }
    getMonthValue(e: any) {
        this.monthnumber = e;
        this.clearShow = true;
        if (this.tabName == 'on-Going') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Completed') {
            this.filterDataComp.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
        this.traineeCount();
    }
    selectedYear(e: any) {
        this.yearNumber = e;
        this.clearShow = true;
        if (this.tabName == 'on-Going') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Completed') {
            this.filterDataComp.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
        this.traineeCount();
    }
    clear() {
        this.searchName = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.clearShow = false;
        if (this.tabName == 'on-Going') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Completed') {
            this.filterDataComp.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
            });
        }

        this.traineeCount();
    }
}
