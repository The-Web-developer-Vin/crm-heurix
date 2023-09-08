import { Component, Inject, OnInit } from '@angular/core';
import {
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

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-update-status-task',
    templateUrl: './update-status-task.component.html',
    styleUrls: ['./update-status-task.component.scss'],
})
export class UpdateStatusTaskComponent implements OnInit {
    createForm!: FormGroup;
    modifyData: any = this.data;
    projectStatus: any;

    showStatus: boolean = false;
    completedStatus: boolean = false;
    constructor(
        private matDialog: MatDialog,
        private dialogRef: MatDialogRef<UpdateStatusTaskComponent>,
        private snackBar: MatSnackBar,
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        private fs: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        console.log('da', this.modifyData);
        this.createForm = this.fs.group({
            status: ['', Validators.required],
            stopped_date: [''],
            completed_date: [''],
            stoppedReason: [
                '',
                this.modifyData?.Data?.status == 'Stopped'
                    ? Validators.required
                    : '',
            ],
        });
        if (this.modifyData) {
            this.createForm.patchValue(this.modifyData.Data);
            if (this.modifyData.Data.status == 'Completed') {
                this.completedStatus = true;
            }
            if (this.modifyData.Data.status == 'Stopped') {
                this.showStatus = true;
            }
        }
    }
    close() {
        this.dialogRef.close('close');
    }
    selectedTimeline(e: any) {
        this.projectStatus = e;
        if (this.projectStatus == 'Stopped') {
            this.showStatus = true;
        } else {
            this.showStatus = false;
        }
        if (this.projectStatus == 'Completed') {
            this.completedStatus = true;
        } else {
            this.completedStatus = false;
        }
    }
    save() {
        if (
            this.createForm.value.status == 'Stopped' &&
            !this.createForm.value.stoppedReason
        ) {
            this.snackBar.open('Stopped Reason is Required', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj: any = {
            id: this.modifyData.Data.projectId
                ? this.modifyData.Data.projectId
                : this.modifyData.Data._id,
        };
        if (this.createForm.value.stoppedReason) {
            obj.stoppedReason = this.createForm.value.stoppedReason;
        }
        this.adminservice.updateProjects(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.createForm.value.name = '';
                this.createForm.reset();
                localStorage.removeItem('employeeslist');
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
