import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'environments/environment';
export interface PeriodicElement {
    project_name: any;
    client_name: any;
    start_date: any;
    end_date: any;
    total_budget: any;
    time_line: any;
}

@Component({
    selector: 'app-single-employee',
    templateUrl: './single-employee.component.html',
    styleUrls: ['./single-employee.component.scss'],
})
export class SingleEmployeeComponent implements OnInit {
    displayedColumns: string[] = [
        'project_name',
        'client_name',
        'start_date',
        'end_date',
        'total_budget',
        'time_line',
    ];
    dataSource = new MatTableDataSource<Element>();
    myDate;
    employeeId: any;
    employeeData: any;
    projectDetails: any = [];
    baseUrl: any;
    constructor(
        private route: ActivatedRoute,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.employeeId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.baseUrl = environment.imageUrl;
        this.getbyemployeeid();

        this.myDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    getbyemployeeid() {
        const pageparams: any = [];
        this.spinner.show();
        this.adminService.getbyEmployeeId(this.employeeId).subscribe(
            (res: any) => {
                this.employeeData = res.data.employee;
                this.projectDetails = res.data.projects;
                this.dataSource = res.data.projects;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    singleProject(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/projects/single?id=${id} `, '_blank');
        });
    }
    singleClient(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/clients/single?id=${id} `, '_blank');
        });
    }
}
