import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-single-project-tasks',
    templateUrl: './single-project-tasks.component.html',
    styleUrls: ['./single-project-tasks.component.scss'],
})
export class SingleProjectTasksComponent implements OnInit {
    tabName: any = 'todo';
    filterData: Subject<any> = new Subject();
    filterDataInprogress: Subject<any> = new Subject();
    filterDataOnHold: Subject<any> = new Subject();
    filterDataCompleted: Subject<any> = new Subject();
    count: any;
    projectId: any;
    projectData: any;
    constructor(
        private route: ActivatedRoute,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.projectId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.getbyProjectid();
        this.getCounts();
    }
    getbyProjectid() {
        const pageparams: any = [];
        this.spinner.show();
        this.adminService.getbyProjectId(this.projectId).subscribe(
            (res: any) => {
                this.projectData = res.data.project;

                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (this.tabName == 'todo') {
            this.filterData.next({
                tabName: this.tabName,
                projectId: this.projectId,
            });
        }
        if (this.tabName == 'inprogress') {
            this.filterDataInprogress.next({
                tabName: this.tabName,
                projectId: this.projectId,
            });
        }
        if (this.tabName == 'onHold') {
            this.filterDataOnHold.next({
                tabName: this.tabName,
                projectId: this.projectId,
            });
        }
        if (this.tabName == 'completed') {
            this.filterDataCompleted.next({
                tabName: this.tabName,
                projectId: this.projectId,
            });
        }
        // this.getCounts()
    }
    getCounts() {
        this.spinner.show();
        this.adminService.getTasksCounts(this.projectId).subscribe(
            (res: any) => {
                this.count = res.data;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    deleteTask(e: any) {
        this.getCounts();
    }
}
