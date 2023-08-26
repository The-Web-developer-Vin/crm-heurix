import { DatePipe } from '@angular/common';
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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminService } from 'app/core/admin/admin.service';
import { TableUtil } from 'app/shared/excel/excel';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddBiddingComponent } from '../add-bidding/add-bidding.component';
import { cloneDeep } from 'lodash';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Subject } from 'rxjs';
export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'DD MMM YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};
@Component({
    selector: 'app-converted-list',
    templateUrl: './converted-list.component.html',
    styleUrls: ['./converted-list.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ConvertedListComponent implements OnInit {
    @Input() categoryName;
    @Input() biddingDate;
    @Input() tabName;
    @Input('filterDataConverted') filterDataConverted: Subject<any>;
    @Output() _searchValue = new EventEmitter();
    @Output() _editBidding = new EventEmitter();

    dataSource = new MatTableDataSource<Element>();
    sortValue = 1;
    displayedColumns = [
        'position',
        'jobtitle',
        'bidUrl',
        'account',
        'technology',
        'time',
        'response',
        'converted',
        'client',
        'reason',
        'crm',
        //'actions',
    ];
    years: any = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    monthnumber: any;

    allBiddings: any;
    sortvalueforJobtitle: any;
    sort: any;
    searchName: any;
    defaultAll: boolean = true;

    total: any;
    person: any;
    currentStatus = 'all';
    employee: any = [];
    clearShow: boolean = false;
    role: any;

    @Input('allList') allList: Subject<any>;
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private _fuseConfirmationService: FuseConfirmationService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;

        if (this.role != 'Admin') {
            this.displayedColumns = [
                'position',
                'jobtitle',
                'bidUrl',
                'account',
                'technology',
                'time',
                'response',
                'converted',
                'reason',
                // 'crm',
                'actions',
            ];
        }
        this.filterDataConverted.subscribe((e) => {
            this.biddingDate = e.biddingDate;
            this.categoryName = e.categoryName;
            this.person = e.person;
            this.tabName = e.tabName;

            this.getbiddigs();
        });
        this.getbiddigs();
    }
    doFilter(value: any) {
        this.searchName = value;
        this.defaultAll = false;
        this.clearShow = true;
        this._searchValue.emit(this.searchName);
        this.getbiddigs();
    }

    deletebidding(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Bidding',
            message: 'Are you sure you want to Delete this Bidding?',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.adminService.deleteBidding(id._id).subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });
                        this._editBidding.emit(0);
                        this.getbiddigs();
                    },
                    (err: any) => {
                        this.snackBar.open(err.error.message, 'Close', {
                            duration: 3000,
                            panelClass: ['alert-red'],
                        });
                    }
                );
            }
        });
    }

    clear() {
        this.searchName = null;

        this.clearShow = false;
        this.person = null;
        this.biddingDate = null;
        // this.currentStatus = 'all';
        if (this.role == 'Admin') {
            this.categoryName = 'dev';
        }
        this.getbiddigs();
    }
    exportTable() {
        TableUtil.exportTableToExcel('BiddingTable');
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getbiddigs();
    }
    getbiddigs() {
        if (this.sortValue == -1) {
            this.sortValue = 1;
        } else {
            this.sortValue = -1;
        }
        this.filterDataConverted.subscribe((e) => {
            this.biddingDate = e.biddingDate;
            this.categoryName = e.categoryName;
            this.person = e.person;
            this.tabName = e.tabName;
        });
        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;
        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }&status=${this.tabName}`;

        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.searchName) {
            pageparams += `&searchKey=${this.searchName}`;
        }
        if (this.biddingDate) {
            pageparams += `&date=${this.biddingDate}`;
        }
        if (this.person) {
            pageparams += `&createdBy=${this.person}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getAllbidding(pageparams).subscribe(
            (res: any) => {
                this.allBiddings = res.data[0].data;
                this.dataSource = res.data[0].data;
                this.pageLength = res.data[0].pagination[0]?.total;
                this.total = res;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }

    editBidding(biddingData) {
        const edit = this.matDialog.open(AddBiddingComponent, {
            width: '50rem',

            data: {
                Data: cloneDeep(biddingData),
            },
        });
        edit.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getbiddigs();
                    this._editBidding.emit(0);
                }
            }
        });
    }
}
