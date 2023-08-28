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
    selector: 'app-google-ads',
    templateUrl: './google-ads.component.html',
    styleUrls: ['./google-ads.component.scss'],
})
export class GoogleAdsComponent implements OnInit {
    googleAdsForm!: FormGroup;
    typesArray: any = [];
    accessArray: any = [];
    googleId: any;
    modify: boolean = false;
    competitorsForm;
    competitorsDetails: FormArray;
    businessForm;
    businessDetails: FormArray;
    offerForm;
    offerDetails: FormArray;

    loginArray: any = [];
    serverShow: boolean = false;
    ftpShow: boolean = false;
    cPanelShow: boolean = false;
    loginUser: any;
    successMsgShow: boolean = false;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private fs: FormBuilder
    ) {
        this.googleAdsForm = new FormGroup({
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
            dailyBudget: new FormControl(''),
            monthlyBudget: new FormControl(''),
            locations: new FormControl(''),
            // offers: new FormControl(''),

            textAds: new FormControl(''),
            bannerAds: new FormControl(''),
            videoAds: new FormControl(''),
            salesAds: new FormControl(''),

            // businessUnique: new FormControl(''),
            adTimings: new FormControl(''),

            googleAds: new FormControl(''),
            googleAnalytics: new FormControl(''),
            gtm: new FormControl(''),
            merchantCenter: new FormControl(''),

            userName: new FormControl(''),
            password: new FormControl(''),
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
        this.businessForm = new FormGroup({
            businessDetails: new FormArray([]),
        });
        this.offerForm = new FormGroup({
            offerDetails: new FormArray([]),
        });
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.loginUser = adminData?.name;
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.googleId = res.id;
                this.getById();
            } else {
                this.addcompetitor('');
                this.addBusiness('');
                this.addOffer('');
            }
        });
    }
    getById() {
        this.modify = true;
        this.adminService.getByAdsId(this.googleId).subscribe((res: any) => {
            this.googleAdsForm.patchValue(res.data.googleAds);
            this.typesArray = res.data.googleAds.adsType;
            this.typesArray.forEach((element) => {
                if (element == 'Text Ads') {
                    this.googleAdsForm.patchValue({
                        textAds: element,
                    });
                }
                if (element == 'Banners Ads') {
                    this.googleAdsForm.patchValue({
                        bannerAds: element,
                    });
                }
                if (element == 'Video Ads') {
                    this.googleAdsForm.patchValue({
                        videoAds: element,
                    });
                }
                if (element == 'Sales Ads') {
                    this.googleAdsForm.patchValue({
                        salesAds: element,
                    });
                }
            });
            this.accessArray = res.data.googleAds.access;
            this.accessArray.forEach((element) => {
                if (element == 'Google Ads') {
                    this.googleAdsForm.patchValue({
                        googleAds: element,
                    });
                }
                if (element == 'Google Analytics') {
                    this.googleAdsForm.patchValue({
                        googleAnalytics: element,
                    });
                }
                if (element == 'GTM') {
                    this.googleAdsForm.patchValue({
                        gtm: element,
                    });
                }
                if (element == 'Merchant Cente') {
                    this.googleAdsForm.patchValue({
                        merchantCenter: element,
                    });
                }
            });
            this.businessDetails = res.data.googleAds.businessUnique;
            res.data.googleAds.businessUnique.forEach((element) => {
                this.addBusiness(element.businessUnique);
            });
            if (!res.data.googleAds.businessUnique.length) {
                this.addBusiness('');
            }
            this.offerDetails = res.data.googleAds.offers;
            res.data.googleAds.offers.forEach((element) => {
                this.addOffer(element.offers);
            });
            if (!res.data.googleAds.offers.length) {
                this.addOffer('');
            }
            res.data.googleAds.competitors.forEach((element) => {
                this.addcompetitor(element.competitors);
            });
            if (!res.data.googleAds.competitors.length) {
                this.addcompetitor('');
            }
            this.competitorsDetails = res.data.googleAds.competitors;
            if (
                res.data.googleAds.serverLink ||
                res.data.googleAds.serverPassword ||
                res.data.googleAds.serverUserName
            ) {
                this.serverShow = true;
                this.googleAdsForm.patchValue({
                    serverLogins: 'Server Logins',
                });
            }
            if (
                res.data.googleAds.ftpIP ||
                res.data.googleAds.ftpPassword ||
                res.data.googleAds.ftpUserName
            ) {
                this.ftpShow = true;
                this.googleAdsForm.patchValue({
                    ftpLogins: 'FTP Logins',
                });
            }
            if (
                res.data.googleAds.cPanelLink ||
                res.data.googleAds.cPanelPassword ||
                res.data.googleAds.cPanelUserName
            ) {
                this.cPanelShow = true;
                this.googleAdsForm.patchValue({
                    cPanelLogins: 'CPanel Logins',
                });
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
    checkAds(e: any, data: any) {
        if (e == true) {
            this.typesArray.push(data);
        }
        if (e == false) {
            this.typesArray.forEach((element, index) => {
                if (element == data) {
                    this.typesArray.splice(index, 1);
                }
            });
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
    createItem(val?): FormGroup {
        return this.fs.group({
            competitors: [val],
        });
    }
    addcompetitor(val?: any) {
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
    createBusinessItem(val?): FormGroup {
        return this.fs.group({
            businessUnique: [val],
        });
    }
    addBusiness(val?) {
        this.businessDetails = this.businessForm.get(
            'businessDetails'
        ) as FormArray;
        this.businessDetails.push(this.createBusinessItem(val));
    }
    deleteBusiness(i: any) {
        if (this.businessDetails.length != 1) {
            const remove = this.businessForm.get(
                'businessDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createOfferItem(val?): FormGroup {
        return this.fs.group({
            offers: [val],
        });
    }
    addOffer(val?: any) {
        this.offerDetails = this.offerForm.get('offerDetails') as FormArray;
        this.offerDetails.push(this.createOfferItem(val));
    }
    deleteOffer(i: any) {
        if (this.offerDetails.length != 1) {
            const remove = this.offerForm.get('offerDetails') as FormArray;
            remove.removeAt(i);
        }
    }
    save() {
        if (this.googleAdsForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj;

        if (this.modify) {
            obj = {
                googleId: this.googleId,
                adsType: this.typesArray,
                access: this.accessArray,
                businessUnique: this.businessDetails.value,
                competitors: this.competitorsDetails.value,
                offers: this.offerDetails.value,
                clientName: this.googleAdsForm.value.clientName,
                mail: this.googleAdsForm.value.mail,
                phoneNumber: this.googleAdsForm.value.phoneNumber,
                address: this.googleAdsForm.value.address,
                websiteUrl: this.googleAdsForm.value.websiteUrl,
                dailyBudget: this.googleAdsForm.value.dailyBudget,
                monthlyBudget: this.googleAdsForm.value.monthlyBudget,
                locations: this.googleAdsForm.value.locations,

                adTimings: this.googleAdsForm.value.adTimings,
                userName: this.googleAdsForm.value.userName,
                password: this.googleAdsForm.value.password,
                serverLink: this.googleAdsForm.value.serverLink,
                serverUserName: this.googleAdsForm.value.serverUserName,
                serverPassword: this.googleAdsForm.value.serverPassword,
                ftpIP: this.googleAdsForm.value.ftpIP,
                ftpUserName: this.googleAdsForm.value.ftpUserName,
                ftpPassword: this.googleAdsForm.value.ftpPassword,
                cPanelLink: this.googleAdsForm.value.cPanelLink,
                cPanelUserName: this.googleAdsForm.value.cPanelUserName,
                cPanelPassword: this.googleAdsForm.value.cPanelPassword,
            };
        } else {
            obj = {
                adsType: this.typesArray,
                access: this.accessArray,
                businessUnique: this.businessDetails.value,
                competitors: this.competitorsDetails.value,
                offers: this.offerDetails.value,
                clientName: this.googleAdsForm.value.clientName,
                mail: this.googleAdsForm.value.mail,
                phoneNumber: this.googleAdsForm.value.phoneNumber,
                address: this.googleAdsForm.value.address,
                websiteUrl: this.googleAdsForm.value.websiteUrl,
                dailyBudget: this.googleAdsForm.value.dailyBudget,
                monthlyBudget: this.googleAdsForm.value.monthlyBudget,
                locations: this.googleAdsForm.value.locations,

                adTimings: this.googleAdsForm.value.adTimings,
                userName: this.googleAdsForm.value.userName,
                password: this.googleAdsForm.value.password,
                serverLink: this.googleAdsForm.value.serverLink,
                serverUserName: this.googleAdsForm.value.serverUserName,
                serverPassword: this.googleAdsForm.value.serverPassword,
                ftpIP: this.googleAdsForm.value.ftpIP,
                ftpUserName: this.googleAdsForm.value.ftpUserName,
                ftpPassword: this.googleAdsForm.value.ftpPassword,
                cPanelLink: this.googleAdsForm.value.cPanelLink,
                cPanelUserName: this.googleAdsForm.value.cPanelUserName,
                cPanelPassword: this.googleAdsForm.value.cPanelPassword,
                createdBy: this.loginUser,
            };
        }

        this.adminService.createGoogleAds(obj).subscribe(
            (res: any) => {
                if (this.modify) {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.router.navigateByUrl('/google-ads');
                } else {
                    this.successMsgShow = true;
                    this.googleAdsForm.reset();
                    this.competitorsForm.reset();
                    this.offerForm.reset();
                    this.businessForm.reset();
                    this.businessForm.value.businessDetails.forEach(
                        (element, index) => {
                            this.deleteBusiness(index);
                        }
                    );
                    this.offerForm.value.offerDetails.forEach(
                        (element, index) => {
                            this.deleteOffer(index);
                        }
                    );
                    this.competitorsForm.value.competitorsDetails.forEach(
                        (element, index) => {
                            this.deletecompetitor(index);
                        }
                    );
                    setTimeout(() => {
                        if (
                            this.loginUser != undefined ||
                            this.loginUser != null
                        ) {
                            this.router.navigateByUrl('/google-ads');
                        } else {
                            this.successMsgShow = false;
                        }
                    }, 8000);
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
