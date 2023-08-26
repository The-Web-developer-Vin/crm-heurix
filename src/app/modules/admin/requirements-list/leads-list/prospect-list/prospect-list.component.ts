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
import { UpdateLeadStatusComponent } from '../update-lead-status/update-lead-status.component';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-prospect-list',
    templateUrl: './prospect-list.component.html',
    styleUrls: ['./prospect-list.component.scss'],
})
export class ProspectListComponent implements OnInit {
    @Input() tabName;
    @Input('filterData') filterData: Subject<any>;

    @Output() _searchValue = new EventEmitter();
    @Output() _deleteLead = new EventEmitter();
    dataSource = new MatTableDataSource<Element>();
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
        'status',
        'followUp',
        'actions',
    ];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    searchName: any;
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
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    doFilter(value: any) {
        this.searchName = value;

        this._searchValue.emit(this.searchName);
        this.getData();
    }
    getData() {
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
        this.spinner.show();
        this.adminService.getLeadsList(pageparams).subscribe(
            (res: any) => {
                if (res.data.leads[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSource = res.data.leads[0].data;
                this.pageLength = res.data.leads[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    edit(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/leads/create?id=${data._id}`, '_blank');
        });
    }
    viewSingleAd(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/leads/client?id=${data._id} `, '_blank');
        });
    }
    delete(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Lead',
            message: 'Are you sure you want to Delete this Lead?',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                let obj = {
                    leadsId: id,
                };

                this.adminService.temporaryDelete(obj).subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });
                        this.getData();
                        this._deleteLead.emit(0);
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
        });
    }
    followUp(e: any) {
        let obj = {
            leadsId: e._id,
        };

        this.adminService.getFollowUpLeads(obj).subscribe(
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
    editStatus(data: any) {
        const addUser = this.matDialog.open(UpdateLeadStatusComponent, {
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
                    this._deleteLead.emit(0);
                }
            }
        });
    }
}
