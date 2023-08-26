import { ContentObserver } from '@angular/cdk/observers';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';

import { AdminService } from 'app/core/admin/admin.service';
import { every } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-latest-payments',
    templateUrl: './latest-payments.component.html',
    styleUrls: ['./latest-payments.component.scss'],
})
export class LatestPaymentsComponent implements OnInit {
    role: any;
    amountValues: any;

    tabName = 'working';

    selectedMonthName: any;
    monthNumber;
    name: any;
    months = [
        { name: 'January ', val: '01' },
        { name: 'February ', val: '02' },
        { name: 'March ', val: '03' },
        { name: 'April ', val: '04' },
        { name: 'May ', val: '05' },
        { name: 'June ', val: '06' },
        { name: 'July ', val: '07' },
        { name: 'August ', val: '08' },
        { name: 'September ', val: '09' },
        { name: 'October ', val: '10' },
        { name: 'November ', val: '11' },
        { name: 'December ', val: '12' },
    ];
    years: any = [];
    yearNumber: any;
    currentYear: any;
    categoryName: any;
    monthlyValues: any;
    currentStatus: any;
    searchName: any;
    monthName: any;
    filterData: Subject<any> = new Subject();
    filterDataWorking: Subject<any> = new Subject();
    filterDataCompleted: Subject<any> = new Subject();
    filterDatastopped: Subject<any> = new Subject();
    filterDataNew: Subject<any> = new Subject();
    filterDataFollow: Subject<any> = new Subject();
    monthlyTabIndex: number;
    yearlyTabIndex: number;
    allList: Subject<any> = new Subject();
    getallcoutries: any;

    currencyName: any;
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private ref: ChangeDetectorRef
    ) {
        // const d = new Date();
        // this.name = this.months[d.getMonth()];
        // this.monthNumber = '0' + (d.getMonth() + 1).toString().slice(-2);

        // this.monthName = this.name.name;

        this.currentYear = new Date().getFullYear();
        let startYear = 2023;
        while (startYear <= this.currentYear) {
            this.years.push(startYear++);
        }
        this.yearNumber = this.currentYear;
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        if (this.role == 'Admin') {
            this.categoryName = 'digital';
        }

        this.getCountryDetails();
        this.currencyName = '6451fb8828010ebb35c7db79';
        this.getmonthlyCount();

        if (this.tabName == 'working') {
            this.filterDataWorking.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'completed') {
            this.filterDataCompleted.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'stopped') {
            this.filterDatastopped.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
    }

    // getAllCounts() {
    //     let pageparams;
    //     if (this.categoryName) {
    //         pageparams = `?type=${this.categoryName}`;
    //     }
    //     this.adminService
    //         .getPaymentsAllCounts(pageparams)
    //         .subscribe((res: any) => {
    //             this.amountValues = res.data;
    //         });
    // }

    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        this.selectedMonthName = this.name.name;
        this.yearNumber = this.currentYear;
        this.searchName = '';
        this.getmonthlyCount();

        if (this.tabName == 'working') {
            this.filterDataWorking.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'completed') {
            this.filterDataCompleted.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'stopped') {
            this.filterDatastopped.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
    }

    getmonthlyCount() {
        let pageparams;
        pageparams = `?year=${this.yearNumber}`;
        if (this.monthNumber) {
            pageparams += `&month=${this.monthNumber}`;
        }
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.tabName) {
            pageparams += `&status=${this.tabName}`;
        }
        if (this.currencyName) {
            pageparams += `&currency=${this.currencyName}`;
        }

        if (this.searchName) {
            pageparams += `&search=${this.searchName}`;
        }
        //this.spinner.show();
        this.adminService.getMonthlyPayments(pageparams).subscribe(
            (res: any) => {
                this.monthlyValues = res.data;
                // this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                //  this.spinner.hide();
            }
        );
    }

    // latest

    getCategory(e: any) {
        this.searchName = null;
        this.categoryName = e;
        const d = new Date();
        let name = this.months[d.getMonth()];

        if (this.tabName == 'working') {
            this.filterDataWorking.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'completed') {
            this.filterDataCompleted.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'stopped') {
            this.filterDatastopped.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }

        this.getmonthlyCount();
        this.getCountryDetails();
    }

    selecteMonth(e: any, values: any) {
        this.monthNumber = e.value;
        const d = new Date();
        let name = this.months[d.getMonth()];

        this.months.forEach((element) => {
            if (element.val == e.value) {
                this.monthName = element.name;
                this.selectedMonthName = element.name;
            }
        });

        if (this.tabName == 'working') {
            this.filterDataWorking.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'completed') {
            this.filterDataCompleted.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'stopped') {
            this.filterDatastopped.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }

        this.getmonthlyCount();
    }
    selectedYear(e: any) {
        this.yearNumber = e.value;

        if (this.tabName == 'working') {
            this.filterDataWorking.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'completed') {
            this.filterDataCompleted.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'stopped') {
            this.filterDatastopped.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }

        this.getmonthlyCount();
    }
    searchEvent(e: any) {
        this.searchName = e;
        // if (this.tabNameMain == 'Yearly') {
        //     if (this.tabName == 'all') {
        //         this.tabName = 'all';
        //     } else if (this.tabName == 'workingY') {
        //         this.tabName = 'working';
        //     } else if (this.tabName == 'completedY') {
        //         this.tabName = 'completed';
        //     } else {
        //         this.tabName = 'stopped';
        //     }
        // }
        this.getmonthlyCount();
    }
    addPayment(e: any) {
        this.allList.next(true);
        this.getmonthlyCount();
    }
    getCountryDetails() {
        let pageParams;
        if (this.categoryName) {
            pageParams = `?type=${this.categoryName}`;
        }
        this.adminService
            .getTypeBasedCurrency(pageParams)
            .subscribe((res: any) => {
                this.getallcoutries = res.data;
            });
    }
    selectedCurrency(e: any) {
        this.currencyName = e;

        if (this.tabName == 'working') {
            this.filterDataWorking.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'completed') {
            this.filterDataCompleted.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }
        if (this.tabName == 'stopped') {
            this.filterDatastopped.next({
                categoryName: this.categoryName,
                monthNumber: this.monthNumber,
                yearNumber: this.yearNumber,
                tabName: this.tabName,
                monthName: this.monthName,

                currencyName: this.currencyName,
            });
        }

        this.getmonthlyCount();
    }
}
