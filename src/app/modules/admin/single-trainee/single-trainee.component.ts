import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-single-trainee',
    templateUrl: './single-trainee.component.html',
    styleUrls: ['./single-trainee.component.scss'],
})
export class SingleTraineeComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = ['paidThrough', 'paidDate', 'paid', 'actions'];
    pageLength: any;
    pageNumber = 1;
    public pageSize = 5;
    traineeId: any;
    // dataSource = new MatTableDataSource<Element>();
    dataSource = new MatTableDataSource<Element>();
    details: any;
    amount: any;
    baseUrl: any;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private adminService: AdminService,
        private spinner: NgxSpinnerService
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.traineeId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.baseUrl = environment.imageUrl;
        this.getDetails();
    }
    getDetails() {
        this.spinner.show();
        this.adminService.traineeGetById(this.traineeId).subscribe(
            (res: any) => {
                this.details = res.data.trainee;
                this.amount = res.data;
                this.dataSource = res.data.milestone;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.show();
            }
        );
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    print(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/trainees/fee?id=${id}`, '_blank');
        });
    }
}
