import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-latest-reports',
    templateUrl: './latest-reports.component.html',
    styleUrls: ['./latest-reports.component.scss'],
})
export class LatestReportsComponent implements OnInit {
    projectTabIndex: number;
    clientTabIndex: number;
    tabNameMain = 'projects';
    tabName: any;
    paymentData: any;
    techData: any;
    details: any;

    clientsData: any;
    clients1Data: any;
    getallcoutries: any;
    currencyName: any;
    currency: any;
    allTab: any = 'all';
    monthnumber: any;
    yearNumber;
    monthName;
    years = [];
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
    filterData: Subject<any> = new Subject();
    filterDataClients: Subject<any> = new Subject();
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
        // month
        const d = new Date();
        let name = this.months[d.getMonth()];
        this.monthnumber = d.getMonth() + 1;
        this.monthName = name;

        // year
        let currentYear = new Date().getFullYear();
        let startYear = 2023;
        while (startYear <= currentYear) {
            this.years.push(startYear++);
        }
        this.yearNumber = currentYear;
    }

    ngOnInit(): void {
        this.currencyName = '6451fb8828010ebb35c7db79';
        if (this.tabNameMain == 'projects') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                currencyName: this.currencyName,
            });
        }
        if (this.tabNameMain == 'clients') {
            this.filterDataClients.next({
                currencyName: this.currencyName,
                yearNumber: this.yearNumber,
            });
        }
        this.getCountryDetails();
    }
    tabClickMain(indexNumber) {
        this.projectTabIndex = 0;
        this.clientTabIndex = 0;
        this.tabNameMain = indexNumber.tab.textLabel;
        if (this.tabNameMain == 'projects') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                currencyName: this.currencyName,
            });
        }
        if (this.tabNameMain == 'clients') {
            this.filterDataClients.next({
                currencyName: this.currencyName,
                yearNumber: this.yearNumber,
            });
        }
    }
    getCountryDetails() {
        let pageParams;
        pageParams = `?all=${this.allTab}`;
        if (this.tabName) {
            pageParams = `?type=${this.tabName}`;
        }
        // if (this.allTab && !this.tabName) {

        // }
        this.adminService
            .getTypeBasedCurrency(pageParams)
            .subscribe((res: any) => {
                this.getallcoutries = res.data;
            });
    }
    selectedCurrency(e: any) {
        this.currencyName = e;
        if (this.tabNameMain == 'projects') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                currencyName: this.currencyName,
            });
        }
        if (this.tabNameMain == 'clients') {
            this.filterDataClients.next({
                currencyName: this.currencyName,
                yearNumber: this.yearNumber,
            });
        }
        //this.getMonthlyReports();
    }
    monthValue(e: any) {
        this.monthnumber = e.value;
        console.log('month', e.value);
        if (this.tabNameMain == 'projects') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                currencyName: this.currencyName,
            });
        }
        if (this.tabNameMain == 'clients') {
            this.filterDataClients.next({
                currencyName: this.currencyName,
                yearNumber: this.yearNumber,
            });
        }
        //this.getMonthlyReports();
    }
    selectedYear(e: any) {
        this.yearNumber = e;
        if (this.tabNameMain == 'projects') {
            this.filterData.next({
                monthnumber: this.monthnumber,
                yearNumber: this.yearNumber,
                currencyName: this.currencyName,
            });
        }
        if (this.tabNameMain == 'clients') {
            this.filterDataClients.next({
                currencyName: this.currencyName,
                yearNumber: this.yearNumber,
            });
        }
        //this.getMonthlyReports();
    }
    tabClickName(e: any) {
        this.tabName = e;
        if (e == '') {
            this.allTab = 'all';
        }
        // if (this.tabName == 'projects') {
        //     this.filterData.next({
        //         monthnumber: this.monthnumber,
        //         yearNumber: this.yearNumber,
        //         currencyName: this.currencyName,
        //     });
        // }
        this.getCountryDetails();
    }
}
