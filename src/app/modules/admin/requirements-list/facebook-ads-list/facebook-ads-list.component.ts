import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-facebook-ads-list',
    templateUrl: './facebook-ads-list.component.html',
    styleUrls: ['./facebook-ads-list.component.scss'],
})
export class FacebookAdsListComponent implements OnInit {
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
        this.adminService.getFacebookAdsList(pageparams).subscribe(
            (res: any) => {
                if (res.data.facebookAds[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSource = res.data.facebookAds[0].data;
                this.pageLength = res.data.facebookAds[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    edit(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/facebook-ads/create?id=${data._id}`, '_blank');
        });
        // this.router.navigateByUrl(`/facebook-ads/create?id=${data._id}`);
    }
    delete(id: any) {
        this.adminService.deleteFacebookAds(id).subscribe(
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
    viewSingleAd(data) {
        this.router.navigate([]).then((result) => {
            window.open(`/facebook-ads/client?id=${data._id} `, '_blank');
        });
    }
}
