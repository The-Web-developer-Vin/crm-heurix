/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
    styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {
    createForm!: FormGroup;
    oldData: any;
    modify: boolean = false;
    disable: boolean = false;
    getallcoutries: any;
    submitted = false;
    selecteddepartments: any;
    modifyData: any = this.data;
    // options: any[] = ['Albania', 'India', 'Algeria'];
    hiredOptions: any[] = ['Test', 'Check', 'Example'];
    paidOptions: any[] = ['Phone pay', 'Google pay', 'Transaction'];
    selectedToppings;
    hiredin: any;
    getallpaids: any;
    role: any;
    constructor(
        private matDialog: MatDialog,
        private dailogRef: MatDialogRef<AddClientComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any },
        private adminService: AdminService
    ) {
        this.createForm = new FormGroup({
            name: new FormControl('', Validators.required),
            country: new FormControl('', Validators.required),
            hiredIn: new FormControl('', Validators.required),
            paidThrough: new FormControl('', Validators.required),
            email: new FormControl(''),
            phone_number: new FormControl(''),
            // department: new FormControl('', Validators.required),
            develepment: new FormControl(''),
            digital_marketing: new FormControl(''),

            // password:new FormControl(''),
            status: new FormControl('Active'),
        });
        if (this.modifyData) {
            this.modify = true;

            this.createForm.patchValue({
                hiredIn: this.modifyData.Data.hiredIn,
            });
            this.createForm.patchValue(this.modifyData.Data);
            this.createForm.patchValue({
                country: this.modifyData.Data.country._id,
                hiredIn: this.modifyData.Data.hiredIn._id,
                paidThrough: this.modifyData.Data.paidThrough._id,
                status: this.modifyData.Data.status.toString(),
            });
            console.log(
                'this.modifyData.Data.paidThrough._id',
                this.modifyData.Data.paidThrough._id
            );
        }

        // this.createForm
        // .get('client_id')
        // .setValue(parseInt(this.modifyData.Data.client_id));
    }

    ngOnInit(): void {
        this.getallCountries();
        this.gethiredIn();
        this.getPaidthrough();
    }
    close() {
        this.dailogRef.close('close');
    }

    eventCheck(event) {
        console.log(event.checked);
    }

    getallCountries() {
        this.adminService.getCountries('').subscribe((res: any) => {
            this.getallcoutries = res.data[0].data;
        });
    }

    gethiredIn() {
        this.adminService.getHiredIn('').subscribe((res: any) => {
            this.hiredin = res.data[0].data;
            console.log('hiredin', this.hiredin);
        });
    }
    getPaidthrough() {
        this.adminService.getPaidThrough('').subscribe((res: any) => {
            this.getallpaids = res.data[0].data;
        });
    }

    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    seleteddepartment(e: any) {
        this.selecteddepartments = e;
        console.log('e', this.selecteddepartments);
    }
    save() {
        if (this.createForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        if (this.modifyData) {
            let obj = {
                id: this.modifyData.Data._id,
                ...this.createForm.value,
            };
            this.adminService.updateClients(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });

                    this.createForm.reset();
                    this.dailogRef.close('submit');
                },
                (err: any) => {
                    this.snackBar.open(err.error.message, 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                    console.log(err);
                }
            );
        } else {
            if (this.createForm.value.develepment == true) {
                this.createForm.value.develepment = true;
            } else {
                this.createForm.value.develepment = false;
            }
            if (this.createForm.value.digital_marketing == true) {
                this.createForm.value.digital_marketing = true;
            } else {
                this.createForm.value.digital_marketing = false;
            }
            if (this.createForm.value.email == '') {
                delete this.createForm.value.email;
            }
            let obj = {
                ...this.createForm.value,
            };
            console.log('obj', obj);
            this.adminService.addClients(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.dailogRef.close('submit');
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
