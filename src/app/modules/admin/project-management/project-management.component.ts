import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssignTasksComponent } from './assign-tasks/assign-tasks.component';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-project-management',
    templateUrl: './project-management.component.html',
    styleUrls: ['./project-management.component.scss'],
})
export class ProjectManagementComponent implements OnInit {
    allList: Subject<any> = new Subject();
    filterData: Subject<any> = new Subject();
    filterDataCompleted: Subject<any> = new Subject();
    filterDataStopped: Subject<any> = new Subject();
    tabName: any = 'Inprogress';
    count: any;
    constructor(
        private matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.tabName == 'Inprogress') {
            this.filterData.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Completed') {
            this.filterDataCompleted.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Stopped') {
            this.filterDataStopped.next({
                tabName: this.tabName,
            });
        }
        this.getCounts();
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (this.tabName == 'Inprogress') {
            this.filterData.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Completed') {
            this.filterDataCompleted.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'Stopped') {
            this.filterDataStopped.next({
                tabName: this.tabName,
            });
        }
        this.getCounts();
    }
    deleteProjectTask(e: any) {
        this.getCounts();
    }
    getCounts() {
        this.spinner.hide();
        this.adminService.getProjectTasksCount().subscribe(
            (res: any) => {
                this.count = res.data;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
}
