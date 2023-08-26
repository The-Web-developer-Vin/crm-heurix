import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-add-bidding',
    templateUrl: './add-bidding.component.html',
    styleUrls: ['./add-bidding.component.scss'],
})
export class AddBiddingComponent implements OnInit {
    createForm!: FormGroup;
    modify: boolean = false;
    modifyData: any = this.data;

    accounts: any;
    getTechnologylist: any = [];
    constructor(
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AddBiddingComponent>,
        private matDialog: MatDialog,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        this.getTechnologyList();
        this.getAccount();
        this.createForm = new FormGroup({
            jobTitle: new FormControl('', Validators.required),
            bidUrl: new FormControl('', Validators.required),
            account: new FormControl('', Validators.required),
            technology: new FormControl('', Validators.required),
            response: new FormControl(''),
            converted: new FormControl(''),
            reason: new FormControl(''),
            followUp: new FormControl(''),
            clientName: new FormControl(''),
        });

        if (this.modifyData) {
            this.modify = true;

            this.createForm.patchValue(this.modifyData.Data);
            this.createForm.patchValue({
                account: this.modifyData.Data.account._id,
                technology: this.modifyData.Data.technology._id,
                converted: this.modifyData.Data.converted.toString(),
                response: this.modifyData.Data.response.toString(),
            });
        }
    }
    close() {
        this.dialogRef.close('close');
    }
    getAccount() {
        this.spinner.show();
        this.adminService.getHiredIn('').subscribe(
            (res: any) => {
                this.accounts = res.data[0].data;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    getTechnologyList() {
        this.adminService.getStream('').subscribe((res: any) => {
            this.getTechnologylist = res.data[0].data;
        });
    }
    save() {
        if (this.modifyData) {
            let obj = {
                bidingId: this.modifyData.Data._id,
                ...this.createForm.value,
            };
            this.spinner.show();
            this.adminService.updateBidding(obj).subscribe(
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
        } else {
            let obj = {
                jobTitle: this.createForm.value.jobTitle,
                bidUrl: this.createForm.value.bidUrl,
                account: this.createForm.value.account,
                technology: this.createForm.value.technology,
            };
            this.spinner.show();
            this.adminService.createBidding(obj).subscribe(
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
                    console.log(err);
                    this.spinner.hide();
                }
            );
        }
    }
}
