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
    selector: 'app-update-calling-status',
    templateUrl: './update-calling-status.component.html',
    styleUrls: ['./update-calling-status.component.scss'],
})
export class UpdateCallingStatusComponent implements OnInit {
    createForm!: FormGroup;
    modifyData: any = this.data;
    showNote: boolean = false;
    coldId: any;
    selectedStatus: any = '';
    statusList: any = [
        {
            name: 'Interested',
            value: 'Interested',
        },
        {
            name: 'Not Interested',
            value: 'Not Interested',
        },
    ];

    constructor(
        private matDialog: MatDialog,
        private fs: FormBuilder,
        private dialogRef: MatDialogRef<UpdateCallingStatusComponent>,
        private snackBar: MatSnackBar,
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        console.log('dhfd', this.modifyData);
        this.createForm = this.fs.group({
            status: [''],
            note: [
                '',
                this.selectedStatus == 'Interested' ? Validators.required : '',
            ],
        });

        if (this.modifyData) {
            this.coldId = this.modifyData.Data._id;
        }
    }
    getStatus(e: any) {
        if (e == 'Interested') {
            this.showNote = true;
        } else {
            this.showNote = false;
        }
    }
    close() {
        this.dialogRef.close('close');
    }

    save() {
        if (this.createForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj = {
            callingId: this.coldId,
            ...this.createForm.value,
        };
        this.spinner.show();
        this.adminservice.updateColdCalling(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.dialogRef.close('submit');
                this.spinner.hide();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
                console.log('err', err);
            }
        );
    }
}
