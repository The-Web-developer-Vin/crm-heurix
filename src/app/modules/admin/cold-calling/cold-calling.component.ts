import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-cold-calling',
    templateUrl: './cold-calling.component.html',
    styleUrls: ['./cold-calling.component.scss'],
})
export class ColdCallingComponent implements OnInit {
    allList: Subject<any> = new Subject();
    filterData: Subject<any> = new Subject();
    filterDataInterested: Subject<any> = new Subject();
    filterDataNotInterested: Subject<any> = new Subject();
    tabName: any = 'all';
    file: File;
    uploadedFile: any;
    count: any;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        if (this.tabName == 'all') {
            this.filterData.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'interested') {
            this.filterDataInterested.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'notInterested') {
            this.filterDataNotInterested.next({
                tabName: this.tabName,
            });
        }
        this.getCounts();
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (this.tabName == 'all') {
            this.filterData.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'interested') {
            this.filterDataInterested.next({
                tabName: this.tabName,
            });
        }
        if (this.tabName == 'notInterested') {
            this.filterDataNotInterested.next({
                tabName: this.tabName,
            });
        }
        this.getCounts();
    }

    fileSelected(event: any) {
        const file = Math.round(event.target.files[0].size / 1024);
        if (file > 30720) {
            this.snackBar.open('File size not more than 30mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        this.file = event.target.files[0];

        let formData = new FormData();
        for (let i = 0; i < event.target.files.length; i++) {
            formData.append('file', event.target.files[i]);
        }

        this.adminService.commonUpload(formData).subscribe(
            (res: any) => {
                this.uploadedFile = res.data.upload[0];
                this.getData(this.uploadedFile);
            },
            (err: any) => {}
        );
    }
    getData(data) {
        let obj = {
            file: data,
        };
        this.spinner.show();
        this.adminService.createColdCalling(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.allList.next(true);
                this.getCounts();
                this.spinner.hide();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
                console.log('err', err);
            }
        );
    }
    getCounts() {
        this.adminService.getColdCounts().subscribe((res: any) => {
            this.count = res.data;
        });
    }
    deleteCalling(e: any) {
        this.getCounts();
    }
}
