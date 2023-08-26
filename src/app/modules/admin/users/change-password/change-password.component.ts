import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    modifyData = this.data;
    submitted: boolean = false;
    constructor(
        private matDialog: MatDialog,
        private fb: FormBuilder,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private snackBar: MatSnackBar
    ) {
        this.changePasswordForm = this.fb.group(
            {
                // new_password: new FormControl('', Validators.required,),
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
                        ),
                        Validators.minLength(8),
                    ],
                ],
                new_password: ['', [Validators.required]],
            },
            {
                validator: this.ConfirmPasswordValidator(
                    'password',
                    'new_password'
                ),
            }
        );
    }

    ngOnInit(): void {
        console.log('modifyData', this.modifyData);
    }
    close() {
        this.matDialog.closeAll();
    }
    ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            let control = formGroup.controls[controlName];
            let matchingControl = formGroup.controls[matchingControlName];
            if (
                matchingControl.errors &&
                !matchingControl.errors['confirmPasswordValidator']
            ) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmPasswordValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }
    resetPassword() {
        this.submitted = true;

        if (this.changePasswordForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        let obj = {
            // id: this.modifyData.id,
            employeeId: this.modifyData.Data._id,
            password: this.changePasswordForm.value.password,
        };
        this.spinner.show();
        this.adminService.updateEmployeePassword(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });

                this.changePasswordForm.reset();
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
        this.matDialog.closeAll();
    }
}
