import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-leads-list',
    templateUrl: './leads-list.component.html',
    styleUrls: ['./leads-list.component.scss'],
})
export class LeadsListComponent implements OnInit {
    allList: Subject<any> = new Subject();
    filterData: Subject<any> = new Subject();
    filterDataLead: Subject<any> = new Subject();
    filterDataOppr: Subject<any> = new Subject();
    filterDataClose: Subject<any> = new Subject();
    filterDataDelete: Subject<any> = new Subject();
    dataSource = new MatTableDataSource<Element>();
    tabName: any = 'prospect';
    displayedColumns = [
        'position',
        'client',
        'email',
        'phone',
        // 'website',
        // 'budget',
        // 'typeAd',
        // 'locations',
        'created',
        'status',
        'actions',
    ];
    searchName: any;
    count: any;
    constructor(
        private adminService: AdminService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        if (this.tabName == 'prospect') {
            this.filterData.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'lead') {
            this.filterDataLead.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'opportunity') {
            this.filterDataOppr.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'close') {
            this.filterDataClose.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'deleted') {
            this.filterDataDelete.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        this.getCounts();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (this.tabName == 'prospect') {
            this.filterData.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'lead') {
            this.filterDataLead.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'opportunity') {
            this.filterDataOppr.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'close') {
            this.filterDataClose.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        if (this.tabName == 'deleted') {
            this.filterDataDelete.next({
                tabName: this.tabName,
                searchName: this.searchName,
            });
        }
        this.getCounts();
    }
    searchEvent(e: any) {
        this.searchName = e;
        this.getCounts();
    }
    deleteLead(e: any) {
        this.getCounts();
    }
    getCounts() {
        this.adminService.getLeadCounts().subscribe((res: any) => {
            this.count = res.data;
        });
    }
}
