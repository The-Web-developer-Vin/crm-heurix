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
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssignTasksComponent } from '../assign-tasks/assign-tasks.component';
import { Subject } from 'rxjs';
import { UpdateStatusTaskComponent } from '../update-status-task/update-status-task.component';

@Component({
    selector: 'app-stopped',
    templateUrl: './stopped.component.html',
    styleUrls: ['./stopped.component.scss'],
})
export class StoppedComponent implements OnInit {
    @Input() tabName;
    @Input('filterDataStopped') filterDataStopped: Subject<any>;
    @Input('allList') allList: Subject<any>;
    @Output() _deleteProjectTasks = new EventEmitter();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'position',
        'project',
        'client',
        'url',
        'startDate',
        'deadLine',
        'status',
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
    doFilter(value: any) {
        this.searchName = value;
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
        this.adminService.getTasksList(pageparams).subscribe(
            (res: any) => {
                this.dataSource = res.data.projects[0].data;
                this.pageLength = res.data.projects[0].pagination?.total;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    viewSingle(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/tasks/project?id=${id} `, '_blank');
        });
    }
    assignTasks(data: any) {
        const editprojectdata = this.matDialog.open(AssignTasksComponent, {
            width: '60rem',
            height: '600px',
            data: {
                Data: cloneDeep(data),
            },
        });
        editprojectdata.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getData();
                }
            }
        });
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    statusUpdate(data: any) {
        const editprojectdata = this.matDialog.open(UpdateStatusTaskComponent, {
            width: '35rem',
            height: '350px',
            data: {
                Data: cloneDeep(data),
            },
        });
        editprojectdata.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getData();
                }
            }
        });
    }
}
