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
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
    @Input() tabName;
    @Input('filterData') filterData: Subject<any>;
    @Input() projectId;
    @Output() _searchValue = new EventEmitter();
    @Output() _deleteTask = new EventEmitter();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'position',
        'module',
        'task',
        'description',
        'employee',
        'startDate',
        //'finished',
        'priority',
        // 'status',
        // 'testing',
        // 'manager',
        'actions',
    ];
    searchName: any;
    dataSource = new MatTableDataSource<Element>();

    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    sortValue = 1;
    sort: any = '';
    constructor(
        private matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private router: Router
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
        }&status=${this.tabName}&projectId=${this.projectId}`;
        if (this.searchName) {
            pageparams += `&search=${this.searchName}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getTaskStatusList(pageparams).subscribe(
            (res: any) => {
                if (res.data.tasks[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSource = res.data.tasks[0].data;
                this.pageLength = res.data.tasks[0].pagination[0]?.total;
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
    }
    edit(data: any) {
        const addPayment = this.matDialog.open(UpdateTaskComponent, {
            width: '40rem',
            //height: '600px',
            data: {
                Data: cloneDeep(data),
            },
        });
        addPayment.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getData();
                    this._deleteTask.emit(0);
                }
            }
        });
    }
    delete(data: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Task',
            message: 'Are you sure you want to Delete this Task?',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.adminService.deleteTask(data._id).subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });
                        this.getData();
                        this._deleteTask.emit(0);
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
