import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    NgForm,
    Validators,
    FormGroup,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseValidators } from '@fuse/validators';
import { AdminService } from 'app/core/admin/admin.service';
import { Router } from '@angular/router';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    // styleUrls: ['./forgor-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    otpForm: FormGroup;
    otpInputConfig: NgxOtpInputConfig = {
        otpLength: 6,
        autofocus: true,
        classList: {
            inputBox: 'my-super-box-class',
            input: 'my-super-class',
            inputFilled: 'my-super-filled-class',
            inputDisabled: 'my-super-disable-class',
            inputSuccess: 'my-super-success-class',
            inputError: 'my-super-error-class',
        },
    };
    showOTP: boolean = false;
    otpValue: any;

    // reset password
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    resetPasswordForm: UntypedFormGroup;
    showResetPassword: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
        this.otpForm = this._formBuilder.group({
            otp: ['', [Validators.required]],
        });
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;
        let obj: any = {
            email: this.forgotPasswordForm.get('email').value,
        };
        // Forgot password
        this._authService
            .forgotPassword(obj)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                    //this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    //this.showAlert = true;
                })
            )
            .subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.showOTP = true;
                },
                (err: any) => {
                    this.snackBar.open(err.error.message, 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                    console.log(err);
                }

                // (response) => {
                //     // Set the alert

                //     this.alert = {
                //         type: 'error',
                //         message: response.error.message,
                //     };
                // }
            );
    }
    handeOtpChange(value: string[]): void {
        console.log('change', value);
    }

    handleFillEvent(value: string): void {
        console.log('fg', value);
        this.otpValue = value;
    }
    verifyOTP() {
        let obj = {
            email: this.forgotPasswordForm.get('email').value,
            code: this.otpValue,
        };
        this.adminService.getVerifyOTP(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.showOTP = false;
                this.showResetPassword = true;
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
    resetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        let obj = {
            email: this.forgotPasswordForm.get('email').value,
            password: this.resetPasswordForm.value.password,
        };
        this.adminService.getResetPassword(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.router.navigateByUrl('/sign-in');
                this.resetPasswordForm.reset();
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
