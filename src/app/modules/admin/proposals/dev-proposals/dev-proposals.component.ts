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
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-dev-proposals',
    templateUrl: './dev-proposals.component.html',
    styleUrls: ['./dev-proposals.component.scss'],
})
export class DevProposalsComponent implements OnInit {
    @Input() tabName;
    @Input('filterData') filterData: Subject<any>;
    @Input('allList') allList: Subject<any>;
    @Output() _deleteProposal = new EventEmitter();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    displayedColumns = [
        'position',
        'client',
        'email',
        'address',
        'date',
        'createdBy',
        'actions',
    ];
    public pageSize = 10;
    pageLength: any;
    pageNumber = 1;
    searchName: any;
    yearNumber: any;
    years: any = [];
    currentYear: any;
    sortValue = 1;
    sort: any = '';
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private snackBar: MatSnackBar
    ) {
        this.currentYear = new Date().getFullYear();
        let startYear = 2023;
        while (startYear <= this.currentYear) {
            this.years.push(startYear++);
        }
        this.yearNumber = this.currentYear;
    }

    ngOnInit(): void {
        this.getData();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    doFilter(value: any) {
        this.searchName = value;
        this.getData();
    }
    selectedYear(e: any) {
        this.yearNumber = e.value;
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
        }&category=${this.tabName}`;
        if (this.yearNumber) {
            pageparams += `&year=${this.yearNumber}`;
        }
        if (this.searchName) {
            pageparams += `&search=${this.searchName}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getProposalList(pageparams).subscribe(
            (res: any) => {
                if (res.data.proposals[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSource = res.data.proposals[0].data;
                this.pageLength = res.data.proposals[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    edit(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/proposals/create?id=${data._id}`, '_blank');
        });
    }

    OpenSettingsDrawer(data: any) {}
    viewSingle(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/proposals/view?id=${data._id}`, '_blank');
        });
    }
}
