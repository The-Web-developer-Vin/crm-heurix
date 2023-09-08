import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { UpdateCallingStatusComponent } from '../update-calling-status/update-calling-status.component';
import { cloneDeep } from 'lodash';
import { TableUtil } from 'app/shared/excel/excel';

@Component({
    selector: 'app-not-interested-list',
    templateUrl: './not-interested-list.component.html',
    styleUrls: ['./not-interested-list.component.scss'],
})
export class NotInterestedListComponent implements OnInit {
    @Input() tabName;
    @Input('filterDataNotInterested') filterDataNotInterested: Subject<any>;
    @Output() _deleteCalling = new EventEmitter();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    searchName: any;
    dataSource = new MatTableDataSource<Element>();

    displayedColumns = [
        'position',
        'name',
        'website',
        'phone',
        'email',
        //'business',
        'rating',
        'ranking',
        'talkClient',
        'status',

        //'actions',
    ];
    checkedList: any = [];
    sortValue = 1;
    sort: any = '';
    constructor(
        private adminService: AdminService,
        private router: Router,
        private snackBar: MatSnackBar,
        private _fuseConfirmationService: FuseConfirmationService,
        private spinner: NgxSpinnerService,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getData();
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getData();
    }
    getData() {
        if (this.sortValue == -1) {
            this.sortValue = 1;
        } else {
            this.sortValue = -1;
        }
        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;
        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }&status=${this.tabName}`;
        if (this.searchName) {
            pageparams += `&search=${this.searchName}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getColdList(pageparams).subscribe(
            (res: any) => {
                if (res.data.coldCalling[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSource = res.data.coldCalling[0].data;
                this.pageLength = res.data.coldCalling[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    doFilter(value: any) {
        this.searchName = value;
        this.getData();
        // this._searchValue.emit(this.searchName);
    }

    changeStatus(data: any) {
        const addUser = this.matDialog.open(UpdateCallingStatusComponent, {
            width: '35rem',
            height: '300px',
            data: {
                Data: cloneDeep(data),
            },
        });
        addUser.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getData();
                    this._deleteCalling.emit(0);
                }
            }
        });
    }

    getCheckedValue(e, data, i) {
        console.log('data', e, data, i);
        if (e.checked == true) {
            this.checkedList.push(data);
        } else {
            this.checkedList.splice(i, 1);
        }

        console.log('checkedList', this.checkedList);
    }
    deleteList() {
        // for (let i = 0; i < this.checkedList.length; i++) {
        //this.spinner.show();
        this.checkedList.forEach((ele) => {
            console.log('ele', ele);
            this.spinner.show();
            this.adminService.deleteColdCalling(ele._id).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.getData();
                    this.checkedList.length = 0;
                    this._deleteCalling.emit(0);
                    this.spinner.hide();
                },
                (err: any) => {
                    this.snackBar.open(err.error.message, 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                    console.log('err', err);

                    this.spinner.hide();
                }
            );
        });
        // }
    }
    viewSingle(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/cold-calling/client?id=${data._id} `, '_blank');
        });
    }
    exportTable() {
        TableUtil.exportTableToExcel('callingTable');
    }
}
