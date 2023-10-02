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
    selector: 'app-facebook-ads',
    templateUrl: './facebook-ads.component.html',
    styleUrls: ['./facebook-ads.component.scss'],
})
export class FacebookAdsComponent implements OnInit {
    facebookAdsForm!: FormGroup;
    typesArray: any = [];
    goalsArray: any = [];
    facebookId: any;
    modify: boolean = false;
    competitorsForm;
    competitorsDetails: FormArray;
    offerForm;
    offerDetails: FormArray;
    accessArray: any = [];
    genderArray: any = [];
    ageArray: any = [];
    segmentsArray: any = [];
    loginUser;
    successMsgShow: boolean = false;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private fs: FormBuilder
    ) {
        this.facebookAdsForm = new FormGroup({
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
            mainService: new FormControl('', Validators.required),
            dailyBudget: new FormControl(''),
            monthlyBudget: new FormControl(''),
            targetedGender: new FormControl(''),
            targetedAge: new FormControl(''),
            targetedSegments: new FormControl(''),

            leads: new FormControl(''),
            sales: new FormControl(''),
            traffic: new FormControl(''),

            carousalAd: new FormControl(''),
            manualAd: new FormControl(''),
            videoAd: new FormControl(''),

            businessTargeted: new FormControl(''),

            adTimings: new FormControl(''),

            userName: new FormControl(''),
            password: new FormControl(''),

            facebookAdAccount: new FormControl(''),
            facebookPage: new FormControl(''),
            facebookBusinessManager: new FormControl(''),
            facebookPixel: new FormControl(''),
            facebookUserName: new FormControl(''),
            facebookPassword: new FormControl(''),
        });
        this.competitorsForm = new FormGroup({
            competitorsDetails: new FormArray([]),
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
                this.facebookId = res.id;
                this.getById();
            } else {
                this.addcompetitor('');
                this.addOffer('');
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
    getById() {
        this.modify = true;
        this.adminService
            .getByFacebookId(this.facebookId)
            .subscribe((res: any) => {
                this.facebookAdsForm.patchValue(res.data.facebookAds);
                this.typesArray = res.data.facebookAds.campaignType;
                this.goalsArray = res.data.facebookAds.campaignGoal;
                this.typesArray.forEach((element) => {
                    if (element == 'Carousal Ads') {
                        this.facebookAdsForm.patchValue({
                            carousalAd: 'carousalAd',
                        });
                    }
                    if (element == 'Manual Ads') {
                        this.facebookAdsForm.patchValue({
                            manualAd: 'manualAd',
                        });
                    }
                    if (element == 'Video Ads') {
                        this.facebookAdsForm.patchValue({
                            videoAd: 'videoAd',
                        });
                    }
                });
                this.goalsArray.forEach((element) => {
                    if (element == 'Leads') {
                        this.facebookAdsForm.patchValue({
                            leads: 'leads',
                        });
                    }
                    if (element == 'Sales') {
                        this.facebookAdsForm.patchValue({
                            sales: 'sales',
                        });
                    }
                    if (element == 'Traffic') {
                        this.facebookAdsForm.patchValue({
                            traffic: 'traffic',
                        });
                    }
                });
                this.competitorsDetails = res.data.facebookAds.competitorsList;
                res.data.facebookAds.competitorsList.forEach((element) => {
                    this.addcompetitor(element.competitors);
                });
                if (!res.data.facebookAds.competitorsList.length) {
                    this.addcompetitor('');
                }
                this.offerDetails = res.data.facebookAds.offers;
                res.data.facebookAds.offers.forEach((element) => {
                    this.addOffer(element.offers);
                });
                if (!res.data.facebookAds.offers.length) {
                    this.addOffer('');
                }
                this.accessArray = res.data.facebookAds.access;

                this.accessArray.forEach((element) => {
                    if (element == 'Facebook Ad Account') {
                        this.facebookAdsForm.patchValue({
                            facebookAdAccount: 'facebookAdAccount',
                        });
                    }
                    if (element == 'Facebook Page') {
                        this.facebookAdsForm.patchValue({
                            facebookPage: 'facebookPage',
                        });
                    }
                    if (element == 'Facebook Business manager account') {
                        this.facebookAdsForm.patchValue({
                            facebookBusinessManager: 'facebookBusinessManager',
                        });
                    }
                    if (element == 'Facebook Pixel') {
                        this.facebookAdsForm.patchValue({
                            facebookPixel: 'facebookPixel',
                        });
                    }
                });
            });
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
    checkGoal(e: any, data: any) {
        if (e == true) {
            this.goalsArray.push(data);
        }
        if (e == false) {
            this.goalsArray.forEach((element, index) => {
                if (element == data) {
                    this.goalsArray.splice(index, 1);
                }
            });
        }
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
    createOfferItem(val?): FormGroup {
        return this.fs.group({
            offers: [val],
        });
    }
    addOffer(val?) {
        this.offerDetails = this.offerForm.get('offerDetails') as FormArray;
        this.offerDetails.push(this.createOfferItem(val));
    }
    deleteOffer(i: any) {
        if (this.offerDetails.length != 1) {
            const remove = this.offerForm.get('offerDetails') as FormArray;
            remove.removeAt(i);
        }
    }
    getGender(val: any) {
        this.genderArray = val;
    }
    getAge(val: any) {
        this.ageArray = val;
    }
    getSegments(val: any) {
        this.segmentsArray = val;
    }
    save() {
        if (this.facebookAdsForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        let obj;
        if (this.modify) {
            obj = {
                facebookId: this.facebookId,
                campaignType: this.typesArray,
                campaignGoal: this.goalsArray,
                offers: this.offerDetails.value,
                access: this.accessArray,
                competitorsList: this.competitorsDetails.value,
                clientName: this.facebookAdsForm.value.clientName,
                mail: this.facebookAdsForm.value.mail,
                phoneNumber: this.facebookAdsForm.value.phoneNumber,
                address: this.facebookAdsForm.value.address,
                websiteUrl: this.facebookAdsForm.value.websiteUrl,
                mainService: this.facebookAdsForm.value.mainService,
                dailyBudget: this.facebookAdsForm.value.dailyBudget,
                monthlyBudget: this.facebookAdsForm.value.monthlyBudget,
                targetedGender: this.facebookAdsForm.value.targetedGender,
                targetedAge: this.facebookAdsForm.value.targetedAge,
                targetedSegments: this.facebookAdsForm.value.targetedSegments,
                businessTargeted: this.facebookAdsForm.value.businessTargeted,
                adTimings: this.facebookAdsForm.value.adTimings,
                userName: this.facebookAdsForm.value.userName,
                password: this.facebookAdsForm.value.password,
                facebookUserName: this.facebookAdsForm.value.facebookUserName,
                facebookPassword: this.facebookAdsForm.value.facebookPassword,
            };
        } else {
            obj = {
                campaignType: this.typesArray,
                campaignGoal: this.goalsArray,
                offers: this.offerDetails.value,
                access: this.accessArray,
                competitorsList: this.competitorsDetails.value,
                clientName: this.facebookAdsForm.value.clientName,
                mail: this.facebookAdsForm.value.mail,
                phoneNumber: this.facebookAdsForm.value.phoneNumber,
                address: this.facebookAdsForm.value.address,
                websiteUrl: this.facebookAdsForm.value.websiteUrl,
                mainService: this.facebookAdsForm.value.mainService,
                dailyBudget: this.facebookAdsForm.value.dailyBudget,
                monthlyBudget: this.facebookAdsForm.value.monthlyBudget,
                targetedGender: this.facebookAdsForm.value.targetedGender,
                targetedAge: this.facebookAdsForm.value.targetedAge,
                targetedSegments: this.facebookAdsForm.value.targetedSegments,
                businessTargeted: this.facebookAdsForm.value.businessTargeted,
                adTimings: this.facebookAdsForm.value.adTimings,
                userName: this.facebookAdsForm.value.userName,
                password: this.facebookAdsForm.value.password,
                facebookUserName: this.facebookAdsForm.value.facebookUserName,
                facebookPassword: this.facebookAdsForm.value.facebookPassword,
                createdBy: this.loginUser,
            };
        }

        this.adminService.createFacebookAds(obj).subscribe(
            (res: any) => {
                if (this.modify) {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.router.navigateByUrl('/facebook-ads');
                } else {
                    this.successMsgShow = true;
                    this.facebookAdsForm.reset();
                    this.competitorsForm.reset();
                    this.offerForm.reset();

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
                            this.router.navigateByUrl('/facebook-ads');
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
