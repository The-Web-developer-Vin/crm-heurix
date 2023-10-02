import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-seo',
    templateUrl: './seo.component.html',
    styleUrls: ['./seo.component.scss'],
})
export class SeoComponent implements OnInit {
    seoForm!: FormGroup;

    seoId: any;
    modify: boolean = false;
    competitorsForm;
    competitorsDetails: FormArray;
    keywordsForm;
    keywordsDetails: FormArray;
    goalsForm;
    goalsDetails: FormArray;
    loginArray: any = [];
    serverShow: boolean = false;
    ftpShow: boolean = false;
    cPanelShow: boolean = false;
    accessArray: any = [];
    loginUser: any;
    successMsgShow: boolean = false;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private fs: FormBuilder
    ) {
        this.seoForm = new FormGroup({
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

            targeted: new FormControl(''),

            specifications: new FormControl(''),
            projectDuration: new FormControl(''),

            googleAds: new FormControl(''),
            googleAnalytics: new FormControl(''),
            gtm: new FormControl(''),
            merchantCenter: new FormControl(''),

            serverLink: new FormControl(
                '',
                Validators.pattern(
                    '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
                )
            ),
            serverUserName: new FormControl(''),
            serverPassword: new FormControl(''),
            ftpIP: new FormControl(''),
            ftpUserName: new FormControl(''),
            ftpPassword: new FormControl(''),
            cPanelLink: new FormControl(
                '',
                Validators.pattern(
                    '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
                )
            ),
            cPanelUserName: new FormControl(''),
            cPanelPassword: new FormControl(''),

            serverLogins: new FormControl(''),
            ftpLogins: new FormControl(''),
            cPanelLogins: new FormControl(''),
        });
        this.competitorsForm = new FormGroup({
            competitorsDetails: new FormArray([]),
        });
        this.keywordsForm = new FormGroup({
            keywordsDetails: new FormArray([]),
        });
        this.goalsForm = new FormGroup({
            goalsDetails: new FormArray([]),
        });
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.loginUser = adminData?.name;
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.seoId = res.id;
                this.getById();
            } else {
                this.addcompetitors('');
                this.addkeywords('');
                this.addgoals('');
            }
        });
    }
    getById() {
        this.modify = true;
        this.adminService.getBySeoId(this.seoId).subscribe((res: any) => {
            this.seoForm.patchValue(res.data.seo);
            this.accessArray = res.data.seo.access;
            this.accessArray.forEach((element) => {
                if (element == 'Google Ads') {
                    this.seoForm.patchValue({
                        googleAds: 'googleAds',
                    });
                }
                if (element == 'Google Analytics') {
                    this.seoForm.patchValue({
                        googleAnalytics: 'googleAnalytics',
                    });
                }
                if (element == 'GTM') {
                    this.seoForm.patchValue({
                        gtm: 'gtm',
                    });
                }
                if (element == 'Merchant Center') {
                    this.seoForm.patchValue({
                        merchantCenter: 'merchantCenter',
                    });
                }
            });
            this.competitorsDetails = res.data.seo.competitorsList;
            res.data.seo.competitorsList.forEach((element) => {
                this.addcompetitors(element.competitors);
            });
            if (!res.data.seo.competitorsList.length) {
                this.addcompetitors('');
            }
            this.keywordsDetails = res.data.seo.targetedKeywords;
            res.data.seo.targetedKeywords.forEach((element) => {
                this.addkeywords(element.keywords);
            });
            if (!res.data.seo.targetedKeywords.length) {
                this.addkeywords('');
            }
            this.goalsDetails = res.data.seo.projectGoals;
            res.data.seo.projectGoals.forEach((element) => {
                this.addgoals(element.projectGoals);
            });
            if (!res.data.seo.projectGoals.length) {
                this.addgoals('');
            }
            if (
                res.data.seo.serverLink ||
                res.data.seo.serverPassword ||
                res.data.seo.serverUserName
            ) {
                this.serverShow = true;
                this.seoForm.patchValue({
                    serverLogins: 'Server Logins',
                });
            }
            if (
                res.data.seo.ftpIP ||
                res.data.seo.ftpPassword ||
                res.data.seo.ftpUserName
            ) {
                this.ftpShow = true;
                this.seoForm.patchValue({
                    ftpLogins: 'FTP Logins',
                });
            }
            if (
                res.data.seo.cPanelLink ||
                res.data.seo.cPanelPassword ||
                res.data.seo.cPanelUserName
            ) {
                this.cPanelShow = true;
                this.seoForm.patchValue({
                    cPanelLogins: 'CPanel Logins',
                });
            }
        });
    }
    checkLogins(e: any, val: any) {
        if (e == true) {
            this.loginArray.push(val);
        } else {
            let index = this.loginArray.indexOf(val);
            this.loginArray.splice(index, 1);
        }
    }
    checkServer(e: any, val: any) {
        if (e == true) {
            this.serverShow = true;
        } else {
            this.serverShow = false;
        }
    }
    checkFtp(e: any, val: any) {
        if (e == true) {
            this.ftpShow = true;
        } else {
            this.ftpShow = false;
        }
    }
    checkCpanel(e: any, val: any) {
        if (e == true) {
            this.cPanelShow = true;
        } else {
            this.cPanelShow = false;
        }
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
    addcompetitors(val?) {
        this.competitorsDetails = this.competitorsForm.get(
            'competitorsDetails'
        ) as FormArray;
        this.competitorsDetails.push(this.createItem(val));
    }
    deletecompetitors(i: any) {
        if (this.competitorsDetails.length != 1) {
            const remove = this.competitorsForm.get(
                'competitorsDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createKeywordItem(val?): FormGroup {
        return this.fs.group({
            keywords: [val],
        });
    }
    addkeywords(val?) {
        this.keywordsDetails = this.keywordsForm.get(
            'keywordsDetails'
        ) as FormArray;
        this.keywordsDetails.push(this.createKeywordItem(val));
    }
    deletekeywords(i: any) {
        if (this.keywordsDetails.length != 1) {
            const remove = this.keywordsForm.get(
                'keywordsDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createGoalsItem(val?): FormGroup {
        return this.fs.group({
            projectGoals: [val],
        });
    }
    addgoals(val?) {
        this.goalsDetails = this.goalsForm.get('goalsDetails') as FormArray;
        this.goalsDetails.push(this.createGoalsItem(val));
    }
    deletegoals(i: any) {
        if (this.goalsDetails.length != 1) {
            const remove = this.goalsForm.get('goalsDetails') as FormArray;
            remove.removeAt(i);
        }
    }
    checkAccess(e: any, data: any) {
        if (e == true) {
            this.accessArray.push(data);
        }
        if (e == false) {
            this.accessArray.forEach((element, index) => {
                if (element == data) {
                    this.accessArray.splice(index, 1);
                }
            });
        }
    }
    save() {
        if (this.seoForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj;
        if (this.modify) {
            obj = {
                seoId: this.seoId,
                access: this.accessArray,
                competitorsList: this.competitorsDetails.value,
                targetedKeywords: this.keywordsDetails.value,
                projectGoals: this.goalsDetails.value,
                clientName: this.seoForm.value.clientName,
                mail: this.seoForm.value.mail,
                phoneNumber: this.seoForm.value.phoneNumber,
                address: this.seoForm.value.address,
                websiteUrl: this.seoForm.value.websiteUrl,
                targeted: this.seoForm.value.targeted,
                specifications: this.seoForm.value.specifications,
                projectDuration: this.seoForm.value.projectDuration,
                serverLink: this.seoForm.value.serverLink,
                serverUserName: this.seoForm.value.serverUserName,
                serverPassword: this.seoForm.value.serverPassword,
                ftpIP: this.seoForm.value.ftpIP,
                ftpUserName: this.seoForm.value.ftpUserName,
                ftpPassword: this.seoForm.value.ftpPassword,
                cPanelLink: this.seoForm.value.cPanelLink,
                cPanelUserName: this.seoForm.value.cPanelUserName,
                cPanelPassword: this.seoForm.value.cPanelPassword,
            };
        } else {
            obj = {
                access: this.accessArray,
                competitorsList: this.competitorsDetails.value,
                targetedKeywords: this.keywordsDetails.value,
                projectGoals: this.goalsDetails.value,
                clientName: this.seoForm.value.clientName,
                mail: this.seoForm.value.mail,
                phoneNumber: this.seoForm.value.phoneNumber,
                address: this.seoForm.value.address,
                websiteUrl: this.seoForm.value.websiteUrl,
                targeted: this.seoForm.value.targeted,
                specifications: this.seoForm.value.specifications,
                projectDuration: this.seoForm.value.projectDuration,
                serverLink: this.seoForm.value.serverLink,
                serverUserName: this.seoForm.value.serverUserName,
                serverPassword: this.seoForm.value.serverPassword,
                ftpIP: this.seoForm.value.ftpIP,
                ftpUserName: this.seoForm.value.ftpUserName,
                ftpPassword: this.seoForm.value.ftpPassword,
                cPanelLink: this.seoForm.value.cPanelLink,
                cPanelUserName: this.seoForm.value.cPanelUserName,
                cPanelPassword: this.seoForm.value.cPanelPassword,
                createdBy: this.loginUser,
            };
        }

        this.adminService.createSeo(obj).subscribe(
            (res: any) => {
                if (this.modify) {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.router.navigateByUrl('/seo');
                } else {
                    this.successMsgShow = true;
                    this.seoForm.reset();
                    this.competitorsForm.reset();
                    this.keywordsForm.reset();
                    this.goalsForm.reset();
                    this.competitorsForm.value.competitorsDetails.forEach(
                        (element, index) => {
                            this.deletecompetitors(index);
                        }
                    );
                    this.keywordsForm.value.keywordsDetails.forEach(
                        (element, index) => {
                            this.deletekeywords(index);
                        }
                    );
                    this.goalsForm.value.goalsDetails.forEach(
                        (element, index) => {
                            this.deletegoals(index);
                        }
                    );
                    setTimeout(() => {
                        if (
                            this.loginUser != undefined ||
                            this.loginUser != null
                        ) {
                            this.router.navigateByUrl('/seo');
                        } else {
                            this.successMsgShow = false;
                        }
                    }, 3000);
                }
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
