import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { subscribeOn } from 'rxjs';

@Component({
    selector: 'app-add-payment',
    templateUrl: './add-payment.component.html',
    styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit {
    createForm!: FormGroup;
    // dataSource = new MatTableDataSource<Element>();
    dataSource = new MatTableDataSource<Element>();
    displayedColumns = ['terms', 'paid', 'paidThrough', 'date'];

    details: any = this.data;
    baseUrl: any;

    constructor(
        private matDialog: MatDialog,
        private dialogRef: MatDialogRef<AddPaymentComponent>,
        private snackBar: MatSnackBar,
        private datePipe: DatePipe,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        this.baseUrl = environment.imageUrl;

        this.dataSource = this.details.Data.milestones;

        this.createForm = new FormGroup({
            amountPaid: new FormControl('', Validators.required),
            paidDate: new FormControl('', Validators.required),
            paidThrough: new FormControl('', Validators.required),
        });
    }

    close() {
        this.dialogRef.close('close');
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
        let obj = {
            amountPaid: Math.floor(this.createForm.value.amountPaid),
            ...this.createForm.value,
            traineeId: this.details.Data._id,
        };
        this.spinner.show();
        this.adminService.createMilstone(obj).subscribe(
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
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
}
