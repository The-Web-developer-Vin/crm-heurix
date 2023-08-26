import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { elementAt } from 'rxjs';

@Component({
    selector: 'app-email-marketing',
    templateUrl: './email-marketing.component.html',
    styleUrls: ['./email-marketing.component.scss'],
})
export class EmailMarketingComponent implements OnInit {
    emailForm!: FormGroup;
    emailId: any;
    modify: boolean = false;
    competitorsForm;
    competitorsDetails: FormArray;
    platformForm;
    platformDetails: FormArray;
    successMsgShow: boolean = false;
    loginUser: any;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private fs: FormBuilder
    ) {
        this.emailForm = new FormGroup({
            clientName: new FormControl('', Validators.required),
            mail: new FormControl('', Validators.email),
            phoneNumber: new FormControl(''),
            address: new FormControl(''),
            websiteUrl: new FormControl('', [
                Validators.required,
                Validators.pattern(
                    '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
                ),
            ]),
            gmailUserName: new FormControl(''),
            gmailPassword: new FormControl(''),
            audienceList: new FormControl(''),
        });
        this.competitorsForm = new FormGroup({
            competitorsDetails: new FormArray([]),
        });
        this.platformForm = new FormGroup({
            platformDetails: new FormArray([]),
        });
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.loginUser = adminData.name;
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.emailId = res.id;
                this.getById();
            } else {
                this.addcompetitor('');
                this.addplatform('', '', '');
            }
        });
    }
    getById() {
        this.modify = true;
        this.adminService.getByEmailId(this.emailId).subscribe((res: any) => {
            this.emailForm.patchValue(res.data.emailMarketing);
            this.competitorsDetails = res.data.emailMarketing.competitorsList;
            res.data.emailMarketing.competitorsList.forEach((element) => {
                this.addcompetitor(element.competitors);
            });
            if (!res.data.emailMarketing.competitorsList.length) {
                this.addcompetitor('');
            }
            this.platformDetails = res.data.emailMarketing.platformLogins;
            res.data.emailMarketing.platformLogins.forEach((element) => {
                this.addplatform(
                    element.platformName,
                    element.userName,
                    element.password
                );
            });
            if (!res.data.emailMarketing.platformLogins.length) {
                this.addplatform('', '', '');
            }
        });
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    createItem(val?): FormGroup {
        return this.fs.group({
            competitors: [val],
        });
    }
    addcompetitor(val?) {
        this.competitorsDetails = this.competitorsForm.get(
            'competitorsDetails'
        ) as FormArray;
        this.competitorsDetails.push(this.createItem(val));
    }
    deletecompetitor(i: any) {
        if (this.competitorsDetails.length != 1) {
            const remove = this.competitorsForm.get(
                'competitorsDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createPlatformItem(val?, v?, p?): FormGroup {
        return this.fs.group({
            platformName: [val],
            userName: [v],
            password: [p],
        });
    }
    addplatform(val?, v?, p?) {
        this.platformDetails = this.platformForm.get(
            'platformDetails'
        ) as FormArray;
        this.platformDetails.push(this.createPlatformItem(val, v, p));
    }
    deleteplatform(i: any) {
        if (this.platformDetails.length != 1) {
            const remove = this.platformForm.get(
                'platformDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    save() {
        if (this.emailForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj;
        if (this.modify) {
            obj = {
                emailId: this.emailId,
                ...this.emailForm.value,
                platformLogins: this.platformDetails.value,
                competitorsList: this.competitorsDetails.value,
            };
        } else {
            obj = {
                ...this.emailForm.value,
                platformLogins: this.platformDetails.value,
                competitorsList: this.competitorsDetails.value,
                createdBy: this.loginUser,
            };
        }

        this.adminService.createEmailMarketing(obj).subscribe(
            (res: any) => {
                // this.snackBar.open(res.message, 'Close', {
                //     duration: 3000,
                // });

                // this.emailForm.reset();
                this.successMsgShow = true;
                setTimeout(() => {
                    this.router.navigateByUrl('/email-marketing');
                }, 10000);
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
