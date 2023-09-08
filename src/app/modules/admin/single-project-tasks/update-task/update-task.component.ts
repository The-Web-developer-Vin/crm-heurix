import { Component, OnInit, Inject } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: 'app-update-task',
    templateUrl: './update-task.component.html',
    styleUrls: ['./update-task.component.scss'],
})
export class UpdateTaskComponent implements OnInit {
    taskId: any;
    taskData = this.data;
    employees: any[];
    updateForm: FormGroup;
    projectId: any;
    testingShow: boolean = false;
    constructor(
        private matDialogref: MatDialogRef<UpdateTaskComponent>,
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private fs: FormBuilder,
        private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.projectId = res.id;
                console.log('prj', this.projectId);
            }
        });
    }

    ngOnInit(): void {
        this.updateForm = new FormGroup({
            moduleName: new FormControl('', Validators.required),
            taskName: new FormControl('', Validators.required),
            employee: new FormControl('', Validators.required),
            priority: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            status: new FormControl(''),
            startDate: new FormControl('', Validators.required),
            testing: new FormControl(''),
            managerTesting: new FormControl(''),
        });

        this.taskId = this.taskData.Data._id;

        this.getById(this.taskId);
        this.getEmployees();
    }
    close() {
        this.matDialogref.close('close');
    }
    getEmployees() {
        this.adminService.getTasksEmployees().subscribe((res: any) => {
            this.employees = res.data.employees;
        });
    }
    getById(id) {
        this.spinner.show();
        this.adminService.getTaskById(id).subscribe(
            (res: any) => {
                this.updateForm.patchValue(res.data.task);
                this.updateForm.patchValue({
                    employee: res.data.task.employee._id,
                });
                if (
                    res.data.task.managerTesting == 'completed' ||
                    res.data.task.testing == 'completed'
                ) {
                    this.testingShow = true;
                }
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    seletedStatus(e: any) {
        console.log('e', e);
        if (e == 'completed') {
            this.testingShow = true;
        } else {
            this.testingShow = false;
        }
    }
    save() {
        if (this.updateForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj = {
            projectId: this.projectId,
            tasksId: this.taskId,
            ...this.updateForm.value,
        };
        console.log('obj', obj);
        this.adminService.createTask(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.matDialogref.close('submit');
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
}
