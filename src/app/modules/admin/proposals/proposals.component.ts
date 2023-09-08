import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-proposals',
    templateUrl: './proposals.component.html',
    styleUrls: ['./proposals.component.scss'],
})
export class ProposalsComponent implements OnInit {
    tabName: any = 'dev';
    allList: Subject<any> = new Subject();
    filterData: Subject<any> = new Subject();
    filterDataDigital: Subject<any> = new Subject();
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        if (this.tabName == 'dev') {
            this.filterData.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'digital') {
            this.filterDataDigital.next({
                tabName: this.tabName,
            });
        }
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (this.tabName == 'dev') {
            this.filterData.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'digital') {
            this.filterDataDigital.next({
                tabName: this.tabName,
            });
        }
    }
    deleteProposal(e: any) {}
    add() {
        this.router.navigate([]).then((result) => {
            window.open(`/proposals/create`, '_blank');
        });
    }
}
