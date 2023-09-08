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
import { AdminService } from 'app/core/admin/admin.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: 'app-assign-tasks',
    templateUrl: './assign-tasks.component.html',
    styleUrls: ['./assign-tasks.component.scss'],
})
export class AssignTasksComponent implements OnInit {
    projectData = this.data;
    tasksForm: FormGroup;
    tasksDetails: FormArray;
    employees: any[];
    selectedEmployee: any;
    constructor(
        private matDialogref: MatDialogRef<AssignTasksComponent>,
        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private fs: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {
        this.tasksForm = new FormGroup({
            tasksDetails: new FormArray([]),
        });
    }

    ngOnInit(): void {
        this.addTasks();
        this.getEmployees();
    }
    getEmployees() {
        this.adminService.getTasksEmployees().subscribe((res: any) => {
            this.employees = res.data.employees;
        });
    }

    close() {
        this.matDialogref.close('close');
    }
    createItem(val?): FormGroup {
        return this.fs.group({
            moduleName: ['', Validators.required],
            taskName: ['', Validators.required],
            startDate: ['', Validators.required],
            employee: [undefined, Validators.required],
            priority: ['', Validators.required],
            description: ['', Validators.required],
        });
    }
    addTasks(val?) {
        this.tasksDetails = this.tasksForm.get('tasksDetails') as FormArray;
        this.tasksDetails.push(this.createItem(val));
    }
    deleteTasks(i: any) {
        if (this.tasksDetails.length != 1) {
            const remove = this.tasksForm.get('tasksDetails') as FormArray;
            remove.removeAt(i);
        }
    }

    save() {
        if (this.tasksForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        for (let i = 0; i < this.tasksDetails.length; i++) {
            let obj = {
                projectId: this.projectData.Data._id,
                ...this.tasksForm.value.tasksDetails[i],
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
}
