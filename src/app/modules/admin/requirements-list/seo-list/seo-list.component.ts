import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-seo-list',
    templateUrl: './seo-list.component.html',
    styleUrls: ['./seo-list.component.scss'],
})
export class SeoListComponent implements OnInit {
    dataSource = new MatTableDataSource<Element>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
        'actions',
    ];
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    searchName: any;
    constructor(
        private adminService: AdminService,
        private router: Router,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.getData();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    doFilter(value: any) {
        this.searchName = value;
        //this.clearShow = true;
        this.getData();
    }
    getData() {
        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;
        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }`;
        if (this.searchName) {
            pageparams += `&search=${this.searchName}`;
        }
        this.spinner.show();
        this.adminService.getSeoList(pageparams).subscribe(
            (res: any) => {
                if (res.data.seo[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSource = res.data.seo[0].data;
                this.pageLength =
                    res.data.seo[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    edit(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/seo/create?id=${data._id}`, '_blank');
        });
        // this.router.navigateByUrl(`/seo/create?id=${data._id}`);
    }
    delete(id: any) {
        this.adminService.deleteSeo(id).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.getData();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                console.log(err);
            }
        );
    }
    viewSingleAd(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/seo/client?id=${data._id} `, '_blank');
        });
    }
}
