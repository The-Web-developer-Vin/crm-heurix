import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ViewMilestonesComponent } from './view-milestones/view-milestones.component';
export interface Element {
    name: string;
    category: string;
    amount: number;
    date: string;
}

@Component({
    selector: 'app-single-client',
    templateUrl: './single-client.component.html',
    styleUrls: ['./single-client.component.scss'],
})
export class SingleClientComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'name',
        'category',
        'date',
        'total',
        'milstones',
        'amount',
        'due',
    ];
    dataSource = new MatTableDataSource<Element>();
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    myDate;
    clientId: any;
    clientData: any;
    projectDetails: any = [];
    totalCount: any;
    filterDate: any;
    defaultAll: boolean = true;
    projectsCount: any;
    currency: any;
    constructor(
        private route: ActivatedRoute,
        private adminService: AdminService,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private router: Router,
        private matDialog: MatDialog
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.clientId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.myDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
        this.getbyClientId();
        this.getProjects();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    getbyClientId() {
        this.spinner.show();
        this.adminService.getbyClientId(this.clientId).subscribe(
            (res: any) => {
                this.clientData = res.data.client;
                this.totalCount = res.data;
                this.projectsCount = res.data.get_project;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    getProjects() {
        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;
        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }`;
        if (this.filterDate) {
            pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
                this.paginator.pageIndex + 1
            }&date=${this.filterDate}`;
        }
        this.spinner.show();
        this.adminService
            .getClientProjects(this.clientId, pageparams)
            .subscribe(
                (res: any) => {
                    this.pageLength = res.data?.payment_count;
                    // this.projectDetails.push({
                    //     totalPaid: res.data.total_amountPaid,
                    //     totals: true,
                    // });
                    this.dataSource = res.data.get_project;
                    this.currency=res.data.currency;
                    this.spinner.hide();
                },
                (err: any) => {
                    this.spinner.hide();
                }
            );
    }
    addEvent(e: any) {
        this.defaultAll = false;
        this.filterDate = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        this.getProjects();
    }
    getAll() {
        this.filterDate = null;
        this.defaultAll = true;
        this.getProjects();
    }
    openSingleProject(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/projects/single?id=${id} `, '_blank');
        });
    }
    viewBudget(budgetData) {
        if (budgetData._id != undefined) {
            const viewBudget = this.matDialog.open(ViewMilestonesComponent, {
                width: '900px',
                height: '600px',
                panelClass: 'views',
                data: {
                    Data: cloneDeep(budgetData),
                },
            });
            viewBudget.afterClosed().subscribe((result) => {});
        }
    }
}
