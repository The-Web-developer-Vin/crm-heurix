import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-update-status',
    templateUrl: './update-status.component.html',
    styleUrls: ['./update-status.component.scss'],
})
export class UpdateStatusComponent implements OnInit {
    createForm!: FormGroup;
    modifyData: any = this.data;
    timeLines: any;
    dates: boolean = false;
    constructor(
        private matDialog: MatDialog,
        private dialogRef: MatDialogRef<UpdateStatusComponent>,
        private snackBar: MatSnackBar,
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        console.log('dhfd', this.modifyData);
        this.createForm = new FormGroup({
            status: new FormControl('', Validators.required),
            resignationDate: new FormControl('', Validators.required),
            relievingDate: new FormControl('', Validators.required),
            company: new FormControl(''),
            location: new FormControl(''),
        });
        if (this.modifyData) {
            if (this.modifyData.Data?.status == 'Relieved') {
                this.dates = true;
                this.createForm.patchValue(this.modifyData.Data);
                this.createForm.patchValue({
                    relievingDate: this.modifyData.Data.relievingDate,
                    resignationDate: this.modifyData.Data.resignationDate,
                    company: this.modifyData.Data.company,
                    location: this.modifyData.Data.location,
                });
            }
        }
    }

    close() {
        this.dialogRef.close('close');
    }
    selectedTimeline(e: any) {
        this.timeLines = e;
        if (this.timeLines == 'Relieved') {
            this.dates = true;
        } else {
            this.dates = false;
        }
    }
    save() {
        if (this.createForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let formData = new FormData();
        formData.append('employeeId', this.modifyData.Data._id);
        formData.append('status', this.createForm.value.status);
        formData.append(
            'resignationDate',
            this.createForm.value.resignationDate
        );
        formData.append('relievingDate', this.createForm.value.relievingDate);
        formData.append(
            'company',
            this.createForm.value.company ? this.createForm.value.company : ''
        );
        formData.append(
            'location',
            this.createForm.value.location ? this.createForm.value.location : ''
        );
        this.spinner.show();
        this.adminservice.editEmployee(formData).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });

                this.createForm.reset();
                this.dialogRef.close('submit');
                this.spinner.hide();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                console.log(err);
                this.spinner.hide();
            }
        );
    }
}
