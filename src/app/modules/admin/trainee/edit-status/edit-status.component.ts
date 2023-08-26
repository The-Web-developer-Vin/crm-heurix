import { Component, OnInit, Inject } from '@angular/core';
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
    selector: 'app-edit-status',
    templateUrl: './edit-status.component.html',
    styleUrls: ['./edit-status.component.scss'],
})
export class EditStatusComponent implements OnInit {
    createForm!: FormGroup;
    timeLines: any;
    dates: boolean = false;
    modifyData: any = this.data;
    constructor(
        private matDialog: MatDialog,
        private dialogRef: MatDialogRef<EditStatusComponent>,
        private snackBar: MatSnackBar,
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        console.log('data', this.modifyData);
        this.createForm = new FormGroup({
            status: new FormControl('', Validators.required),
            company: new FormControl(''),
            package: new FormControl(''),
            completedDate: new FormControl('', Validators.required),
        });
        if (this.modifyData) {
            this.createForm.patchValue(this.modifyData.Data);
            if (this.modifyData.Data.status == 'completed') {
                this.dates = true;
                this.createForm.patchValue({
                    completedDate: this.modifyData.Data?.completedDate,
                });
            }
        }
    }
    close() {
        this.dialogRef.close('close');
    }
    selectedTimeline(e: any) {
        this.timeLines = e;
        if (this.timeLines == 'completed') {
            this.dates = true;
        } else {
            this.dates = false;
        }
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
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
        formData.append('id', this.modifyData.Data._id);
        formData.append(
            'status',
            this.createForm.value.status ? this.createForm.value.status : ''
        );
        formData.append(
            'completedDate',
            this.createForm.value.completedDate
                ? this.createForm.value.completedDate
                : ''
        );
        formData.append(
            'company',
            this.createForm.value.company ? this.createForm.value.company : ''
        );
        formData.append(
            'package',
            this.createForm.value.package ? this.createForm.value.package : ''
        );
        formData.append('courseFee', this.modifyData.Data?.courseFee);
        formData.append('discountNumber', this.modifyData.Data?.discountNumber);
        this.spinner.show();
        this.adminservice.editTrainee(formData).subscribe(
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
