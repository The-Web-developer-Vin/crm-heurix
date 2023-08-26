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
    selector: 'app-smo',
    templateUrl: './smo.component.html',
    styleUrls: ['./smo.component.scss'],
})
export class SmoComponent implements OnInit {
    smoForm!: FormGroup;

    smoId: any;
    modify: boolean = false;
    competitorsForm;
    competitorsDetails: FormArray;
    goalsForm;
    goalsDetails: FormArray;
    offerForm;
    offerDetails: FormArray;
    fbShow: boolean = false;
    instaShow: boolean = false;
    twitterShow: boolean = false;
    linkedShow: boolean = false;
    pinShow: boolean = false;
    socialLoginArray: any = [];
    newAccounts: any = [];
    genderArray: any = [];
    ageArray: any = [];
    segmentsArray: any = [];
    loginUser: any;
    successMsgShow: boolean = false;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private fs: FormBuilder
    ) {
        this.smoForm = new FormGroup({
            clientName: new FormControl('', Validators.required),
            mail: new FormControl(''),
            phoneNumber: new FormControl(''),
            address: new FormControl(''),
            websiteUrl: new FormControl('', [
                Validators.required,
                Validators.pattern(
                    '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
                ),
            ]),

            facebookUrl: new FormControl(''),
            facebookUserName: new FormControl(''),
            facebookPassword: new FormControl(''),

            instagramUrl: new FormControl(''),
            instagramUserName: new FormControl(''),
            instagramPassword: new FormControl(''),

            twitterUrl: new FormControl(''),
            twitterUserName: new FormControl(''),
            twitterPassword: new FormControl(''),

            linkedInUrl: new FormControl(''),
            linkedInUserName: new FormControl(''),
            linkedInPassword: new FormControl(''),

            pinterestUrl: new FormControl(''),
            pinterestUserName: new FormControl(''),
            pinterestPassword: new FormControl(''),

            additionalInfo: new FormControl(''),

            targetedGender: new FormControl(''),
            targetedAge: new FormControl(''),
            targetedSegments: new FormControl(''),
            projectDuration: new FormControl(''),

            facebook: new FormControl(''),
            instagram: new FormControl(''),
            twitter: new FormControl(''),
            linkedin: new FormControl(''),
            pinterest: new FormControl(''),

            existfacebook: new FormControl(''),
            existinstagram: new FormControl(''),
            existtwitter: new FormControl(''),
            existlinkedin: new FormControl(''),
            existpinterest: new FormControl(''),
        });
        this.competitorsForm = new FormGroup({
            competitorsDetails: new FormArray([]),
        });
        this.goalsForm = new FormGroup({
            goalsDetails: new FormArray([]),
        });
        this.offerForm = new FormGroup({
            offerDetails: new FormArray([]),
        });
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.loginUser = adminData.name;
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.smoId = res.id;
                this.getById();
            } else {
                this.addcompetitors('');
                this.addgoals('');
                this.addOffer('');
            }
        });
    }
    getById() {
        this.modify = true;
        this.adminService.getBySmoId(this.smoId).subscribe((res: any) => {
            this.smoForm.patchValue(res.data.smo);
            this.newAccounts = res.data.smo.socialMediaCreate;
            this.genderArray = res.data.smo.targetedGender;
            this.ageArray = res.data.smo.targetedAge;
            this.segmentsArray = res.data.smo.targetedSegments;
            this.newAccounts.forEach((element) => {
                if (element == 'Facebook') {
                    this.smoForm.patchValue({
                        facebook: 'facebook',
                    });
                }
                if (element == 'Instagram') {
                    this.smoForm.patchValue({
                        instagram: 'instagram',
                    });
                }
                if (element == 'Twitter') {
                    this.smoForm.patchValue({
                        twitter: 'twitter',
                    });
                }
                if (element == 'Linkedin') {
                    this.smoForm.patchValue({
                        linkedin: 'linkedin',
                    });
                }
                if (element == 'Pinterest') {
                    this.smoForm.patchValue({
                        pinterest: 'pinterest',
                    });
                }
            });
            this.competitorsDetails = res.data.smo.competitorsList;
            res.data.smo.competitorsList.forEach((element) => {
                this.addcompetitors(element.competitors);
            });
            if (!res.data.smo.competitorsList.length) {
                this.addcompetitors('');
            }
            this.goalsDetails = res.data.smo.projectGoals;
            res.data.smo.projectGoals.forEach((element) => {
                this.addgoals(element.projectGoals);
            });
            if (!res.data.smo.projectGoals.length) {
                this.addgoals('');
            }
            this.offerDetails = res.data.smo.offers;
            res.data.smo.offers.forEach((element) => {
                this.addOffer(element.offers);
            });
            if (!res.data.smo.offers.length) {
                this.addOffer('');
            }
            if (
                res.data.smo.facebookUrl ||
                res.data.smo.facebookUserName ||
                res.data.smo.facebookPassword
            ) {
                this.fbShow = true;
                this.smoForm.patchValue({
                    existfacebook: 'existfacebook',
                });
            }
            if (
                res.data.smo.instagramUrl ||
                res.data.smo.instagramUserName ||
                res.data.smo.instagramPassword
            ) {
                this.instaShow = true;
                this.smoForm.patchValue({
                    existinstagram: 'existinstagram',
                });
            }
            if (
                res.data.smo.twitterUrl ||
                res.data.smo.twitterUserName ||
                res.data.smo.twitterPassword
            ) {
                this.twitterShow = true;
                this.smoForm.patchValue({
                    existtwitter: 'existtwitter',
                });
            }
            if (
                res.data.smo.linkedInUrl ||
                res.data.smo.linkedInUserName ||
                res.data.smo.linkedInPassword
            ) {
                this.linkedShow = true;
                this.smoForm.patchValue({
                    existlinkedin: 'existlinkedin',
                });
            }
            if (
                res.data.smo.pinterestUrl ||
                res.data.smo.pinterestUserName ||
                res.data.smo.pinterestPassword
            ) {
                this.pinShow = true;
                this.smoForm.patchValue({
                    existpinterest: 'existpinterest',
                });
            }
        });
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
    checkSocialLogins(e: any, val: any) {
        if (e == true) {
            this.socialLoginArray.push(val);
        } else {
            let index = this.socialLoginArray.indexOf(val);
            this.socialLoginArray.splice(index, 1);
        }
    }
    checkFacebook(e: any, val: any) {
        if (e == true) {
            this.fbShow = true;
        } else {
            this.fbShow = false;
        }
    }
    checkInsta(e: any, val: any) {
        if (e == true) {
            this.instaShow = true;
        } else {
            this.instaShow = false;
        }
    }
    checkTwitter(e: any, val: any) {
        if (e == true) {
            this.twitterShow = true;
        } else {
            this.twitterShow = false;
        }
    }
    checkLinked(e: any, val: any) {
        if (e == true) {
            this.linkedShow = true;
        } else {
            this.linkedShow = false;
        }
    }
    checkPin(e: any, val: any) {
        if (e == true) {
            this.pinShow = true;
        } else {
            this.pinShow = false;
        }
    }

    checkNew(e: any, val: any) {
        if (e == true) {
            this.newAccounts.push(val);
        }
        if (e == false) {
            this.newAccounts.forEach((element, index) => {
                if (element == val) {
                    this.newAccounts.splice(index, 1);
                }
            });
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
        if (this.smoForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj;
        if (this.modify) {
            obj = {
                smoId: this.smoId,
                socialMediaCreate: this.newAccounts,
                competitorsList: this.competitorsDetails.value,
                offers: this.offerDetails.value,
                projectGoals: this.goalsDetails.value,
                clientName: this.smoForm.value.clientName,
                mail: this.smoForm.value.mail,
                phoneNumber: this.smoForm.value.phoneNumber,
                address: this.smoForm.value.address,
                websiteUrl: this.smoForm.value.websiteUrl,
                facebookUrl: this.smoForm.value.facebookUrl,
                facebookUserName: this.smoForm.value.facebookUserName,
                facebookPassword: this.smoForm.value.facebookPassword,
                instagramUrl: this.smoForm.value.instagramUrl,
                instagramUserName: this.smoForm.value.instagramUserName,
                instagramPassword: this.smoForm.value.instagramPassword,
                twitterUrl: this.smoForm.value.twitterUrl,
                twitterUserName: this.smoForm.value.twitterUserName,
                twitterPassword: this.smoForm.value.twitterPassword,
                linkedInUrl: this.smoForm.value.linkedInUrl,
                linkedInUserName: this.smoForm.value.linkedInUserName,
                linkedInPassword: this.smoForm.value.linkedInPassword,
                pinterestUrl: this.smoForm.value.pinterestUrl,
                pinterestUserName: this.smoForm.value.pinterestUserName,
                pinterestPassword: this.smoForm.value.pinterestPassword,
                additionalInfo: this.smoForm.value.additionalInfo,
                targetedGender: this.smoForm.value.targetedGender,
                targetedAge: this.smoForm.value.targetedAge,
                targetedSegments: this.smoForm.value.targetedSegments,
                projectDuration: this.smoForm.value.projectDuration,
            };
        } else {
            obj = {
                socialMediaCreate: this.newAccounts,
                competitorsList: this.competitorsDetails.value,
                offers: this.offerDetails.value,
                projectGoals: this.goalsDetails.value,
                clientName: this.smoForm.value.clientName,
                mail: this.smoForm.value.mail,
                phoneNumber: this.smoForm.value.phoneNumber,
                address: this.smoForm.value.address,
                websiteUrl: this.smoForm.value.websiteUrl,
                facebookUrl: this.smoForm.value.facebookUrl,
                facebookUserName: this.smoForm.value.facebookUserName,
                facebookPassword: this.smoForm.value.facebookPassword,
                instagramUrl: this.smoForm.value.instagramUrl,
                instagramUserName: this.smoForm.value.instagramUserName,
                instagramPassword: this.smoForm.value.instagramPassword,
                twitterUrl: this.smoForm.value.twitterUrl,
                twitterUserName: this.smoForm.value.twitterUserName,
                twitterPassword: this.smoForm.value.twitterPassword,
                linkedInUrl: this.smoForm.value.linkedInUrl,
                linkedInUserName: this.smoForm.value.linkedInUserName,
                linkedInPassword: this.smoForm.value.linkedInPassword,
                pinterestUrl: this.smoForm.value.pinterestUrl,
                pinterestUserName: this.smoForm.value.pinterestUserName,
                pinterestPassword: this.smoForm.value.pinterestPassword,
                additionalInfo: this.smoForm.value.additionalInfo,
                targetedGender: this.smoForm.value.targetedGender,
                targetedAge: this.smoForm.value.targetedAge,
                targetedSegments: this.smoForm.value.targetedSegments,
                projectDuration: this.smoForm.value.projectDuration,
                createdBy: this.loginUser,
            };
        }

        this.adminService.createSmo(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });

                // this.smoForm.reset();
                this.successMsgShow = true;
                setTimeout(() => {
                    this.router.navigateByUrl('/smo');
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

    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
