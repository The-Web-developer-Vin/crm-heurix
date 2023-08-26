import { Component, OnInit } from '@angular/core';
import { AddBiddingComponent } from './add-bidding/add-bidding.component';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'app/core/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
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
    selector: 'app-latest-bidding-report',
    templateUrl: './latest-bidding-report.component.html',
    styleUrls: ['./latest-bidding-report.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class LatestBiddingReportComponent implements OnInit {
    role: any;
    categoryName = '';
    total: any;
    tabName = 'all';
    allList: Subject<any> = new Subject();
    filterData: Subject<any> = new Subject();
    filterDataResponse: Subject<any> = new Subject();
    filterDataConverted: Subject<any> = new Subject();
    biddingDate: any;
    personId: any;
    counts: any;
    employee: any;
    person: any;
    searchName: any;
    clearShow: boolean = true;
    defaultAll: boolean = false;
    allBidding: any;

    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private _fuseConfirmationService: FuseConfirmationService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe
    ) {
        const d = new Date();
        this.biddingDate = this.datePipe.transform(d, 'yyyy-MM-dd');
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        if (this.role == 'Admin') {
            this.categoryName = 'dev';
        }
        this.getBiddingCount();
        this.getBiddingEmp();
        // this.allList.subscribe((e) => {
        //     this.getBiddingCount();
        // });
        if (this.tabName == 'all') {
            this.filterData.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'response') {
            this.filterDataResponse.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'converted') {
            this.filterDataConverted.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
    }
    addBidding() {
        const addbidding = this.matDialog.open(AddBiddingComponent, {
            width: '50rem',
        });
        addbidding.afterClosed().subscribe((result) => {
           
            if (result != 'close') {
                if (result) {
                    this.allList.next(true);
                    this.getBiddingCount();
                }
            }
        });
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (this.tabName == 'all') {
            this.filterData.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                tabName: this.tabName,
                person: this.person,
            });
        }
        if (this.tabName == 'response') {
            this.filterDataResponse.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'converted') {
            this.filterDataConverted.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        this.getBiddingCount();
    }
    DateData(e: any) {
        this.biddingDate = e;
        this.getBiddingCount();
    }
    PersonData(e: any) {
        this.personId = e;
        this.getBiddingCount();
    }
    categoryData(e: any) {
        this.categoryName = e;
        this.getBiddingCount();
    }
    getBiddingCount() {
        let pageparams;
        pageparams = `?date=${this.biddingDate}`;
        if (this.allBidding) {
            pageparams = `?total=${this.allBidding}`;
        }
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.tabName) {
            pageparams += `&status=${this.tabName}`;
        }
        if (this.personId) {
            pageparams += `&createdBy=${this.personId}`;
        }
        if (this.searchName) {
            pageparams += `&searchKey=${this.searchName}`;
        }
        this.spinner.show();
        this.adminService.getBiddingCounts(pageparams).subscribe(
            (res: any) => {
                this.counts = res.data;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    searchEvent(e: any) {
        console.log('e', e);
        this.searchName = e;
        this.getBiddingCount();
    }
    // latest changes
    getCategory(e: any) {
        this.categoryName = e;
        this.person = '';
        if (this.tabName == 'all') {
            this.filterData.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'response') {
            this.filterDataResponse.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'converted') {
            this.filterDataConverted.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        this.getBiddingCount();
    }

    getBiddingEmp() {
        this.adminService.getBiddingEmployees().subscribe((res: any) => {
            this.employee = res.data.employee;
        });
    }
    selectManager(e: any) {
        this.person = e;
        this.categoryName = '';
        if (this.tabName == 'all') {
            this.filterData.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'response') {
            this.filterDataResponse.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'converted') {
            this.filterDataConverted.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        this.getBiddingCount();
    }
    selectedDate(e: any) {
        this.biddingDate = this.datePipe.transform(
            e.target.value,
            'yyyy-MM-dd'
        );
        this.allBidding = '';
        if (this.tabName == 'all') {
            this.filterData.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'response') {
            this.filterDataResponse.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'converted') {
            this.filterDataConverted.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        this.clearShow = true;

        this.defaultAll = false;
        this.getBiddingCount();
    }
    editBidding(e: any) {
        this.getBiddingCount();
    }
    getAll() {
        this.allBidding = 'all';
        this.defaultAll = true;
        //this.clearShow = false;
        this.biddingDate = null;
        if (this.tabName == 'all') {
            this.filterData.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'response') {
            this.filterDataResponse.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'converted') {
            this.filterDataConverted.next({
                categoryName: this.categoryName,
                biddingDate: this.biddingDate,
                person: this.person,
                tabName: this.tabName,
            });
        }

        this.getBiddingCount();
    }
    clear() {
        this.biddingDate = null;
        this.person = null;
        this.allBidding = '';
        this.defaultAll = false;
        this.clearShow = false;
    }
}
