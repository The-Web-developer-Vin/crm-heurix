import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { Subject } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-deleted-list',
    templateUrl: './deleted-list.component.html',
    styleUrls: ['./deleted-list.component.scss'],
})
export class DeletedListComponent implements OnInit {
    @Input() tabName;
    @Input('filterDataDelete') filterDataDelete: Subject<any>;

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
                this.adminService.deleteLeads(id).subscribe(
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
    restore(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Resore Lead',
            message: 'Are you sure you want to Restore this Lead?',
            actions: {
                confirm: {
                    label: 'Restore',
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
}
