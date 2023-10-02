import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { CommonUploadModalComponent } from './common-upload-modal/common-upload-modal.component';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-website-design',
    templateUrl: './website-design.component.html',
    styleUrls: ['./website-design.component.scss'],
})
export class WebsiteDesignComponent implements OnInit {
    websiteDesignForm!: FormGroup;
    typesArray: any = [];
    goalsArray: any = [];
    websiteId: any;
    modify: boolean = false;
    imageAttr = '';
    docAttr = '';
    otherAttr = '';
    file: File;
    referenceUrlForm;
    pagesForm;
    featuresForm;
    colorForm;
    referenceDetails: FormArray;
    others: FormArray;
    other: FormArray;
    colorDetails: FormArray;
    keywordsForm;
    keywordsDetails: FormArray;
    existingLikeForm;
    existingLikeDetails: FormArray;
    additionalForm;
    additionalDetails: FormArray;

    color = '#ff00ff';
    message = 'Empty';
    image: any;
    contentData: any;
    platform: any;
    otherShow: boolean = false;
    otherPageShow: boolean = false;
    otherFeaturesShow: boolean = false;
    contentUploadShow: boolean = false;
    updatingshow: boolean = false;
    bloggingshow: boolean = false;
    featuresArray: any = [];
    iconShow: boolean = false;
    headerShow: boolean = false;
    domainShow: boolean = false;
    otherServiceShow: boolean = false;

    serviceForm: FormGroup;
    hostShow: boolean = false;
    audienceList: any = [];
    contectDoc: any;
    additionalServices: any = [];
    ecommerceNeed: any;
    otherDocuments: any;
    launchingDate: any;
    home: any;
    checkPagesList = [
        { name: 'home', label: 'Home', checked: false },
        { name: 'aboutus', label: 'About Us', checked: false },
        { name: 'imageGallery', label: 'Image Gallery', checked: false },
        { name: 'videoGallery', label: 'Video Gallery', checked: false },
        { name: 'testimonials', label: 'Testimonials', checked: false },
        { name: 'blog', label: 'Blog', checked: false },
        { name: 'contactus', label: 'Contact us', checked: false },
    ];
    checkedPages: any;
    servicesList: any;
    checkedHomeNeeds: any;
    headerCheck: any;
    socialCheck: any;
    featuresSocialArray: any = [];

    homePagesList = [
        {
            name: 'headerBanner',
            label: 'Header Banner',
            checked: false,
            children: [
                { name: 'imageSlider', label: 'Images Slider', checked: false },
                {
                    name: 'videoAnimations',
                    label: 'Video Animations',
                    checked: false,
                },
                {
                    name: 'graphicalBanner',
                    label: 'Graphical Banner',
                    checked: false,
                },
            ],
        },
        { name: 'testimonials', label: 'Testimonials', checked: false },
        {
            name: 'socialMediaIcons',
            label: 'Social Media Icons',
            checked: false,
            children: [
                { name: 'facebook', label: 'Facebook', checked: false },
                { name: 'instagram', label: 'Instagram', checked: false },
                { name: 'twitter', label: 'Twitter', checked: false },
                { name: 'linkedin', label: 'Linkedin', checked: false },
                { name: 'pinterest', label: 'Pinterest', checked: false },
                { name: 'threads', label: 'Threads', checked: false },
            ],
        },
        { name: 'welcomeText', label: 'Company Welcome Text', checked: false },
        { name: 'blog', label: 'Blog', checked: false },
        {
            name: 'actionButtons',
            label: 'Call-to-Action buttons',
            checked: false,
        },
        { name: 'products', label: 'Products/Services', checked: false },
        { name: 'footer', label: 'Footer', checked: false },
        {
            name: 'signIn_Up',
            label: 'Customer Sign in/Sign up',
            checked: false,
        },
        { name: 'imageGallery', label: 'Image Gallery', checked: false },
        { name: 'pricingTables', label: 'Pricing tables', checked: false },
        { name: 'other', label: 'Other', checked: false },
    ];
    websiteImprove: any;
    additionalServicesList = [
        { name: 'logoDesign', label: 'Logo Design', checked: false },
        { name: 'brochureDesign', label: 'Brochure Design', checked: false },
        { name: 'visitingCard', label: 'Visiting Card', checked: false },
        { name: 'staffId', label: 'Staff ID Card', checked: false },
        { name: 'seo', label: 'SEO', checked: false },
        { name: 'smo', label: 'SMO', checked: false },
        { name: 'adwords', label: 'Adwords', checked: false },
        { name: 'other', label: 'Other', checked: false },
    ];
    checkedAdditional: any;
    hostingData: any;
    servicesPageList: any = [];
    domainData: any;
    otherCheck: any = [];
    modifyPagesNeed: any;
    modifyHomeNeeds: any;
    modifyAdditinaolServices: any;
    loginUser: any;
    successMsgShow: boolean = false;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private fs: FormBuilder,
        private datePipe: DatePipe,
        private matDialog: MatDialog
    ) {
        this.websiteDesignForm = new FormGroup({
            clientName: new FormControl('', Validators.required),
            mail: new FormControl('', Validators.email),
            phoneNumber: new FormControl(''),
            address: new FormControl(''),

            logoImage: new FormControl(''),
            logoText: new FormControl(''),
            companyTagLine: new FormControl(''),
            companyDo: new FormControl(''),
            targetAudience: new FormControl(''),
            existingUrl: new FormControl(''),
            platform: new FormControl(''),
            contentFile: new FormControl(''),
            budget: new FormControl(''),
            hostUrl: new FormControl(''),
            hostUserName: new FormControl(''),
            hostPassword: new FormControl(''),
            domainUserName: new FormControl(''),
            domainPassword: new FormControl(''),
            launchingDate: new FormControl(''),
            otherDoc: new FormControl(''),
            websiteImprove: new FormControl(''),
            contentReady: new FormControl(''),
        });
        this.referenceUrlForm = new FormGroup({
            referenceDetails: new FormArray([]),
        });
        this.pagesForm = new FormGroup({
            others: new FormArray([]),
        });
        this.featuresForm = new FormGroup({
            other: new FormArray([]),
        });
        this.colorForm = new FormGroup({
            colorDetails: new FormArray([]),
        });
        this.keywordsForm = new FormGroup({
            keywordsDetails: new FormArray([]),
        });
        this.existingLikeForm = new FormGroup({
            existingLikeDetails: new FormArray([]),
        });
        this.additionalForm = new FormGroup({
            additionalDetails: new FormArray([]),
        });
        this.serviceForm = this.fs.group({
            services: this.fs.array([]),
        });
    }

    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.loginUser = adminData?.name;
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.websiteId = res.id;
                this.getById();
            } else {
                this.addRefer('', '');
                this.addFeature('');
                this.addColor('');
                this.addkeywords('');
                this.addExisting('');
                this.addadditional('');
            }
        });
    }
    getById() {
        this.modify = true;
        this.adminService
            .getByWebsiteDesign(this.websiteId)
            .subscribe((res: any) => {
                this.websiteDesignForm.patchValue(res.data.websiteDesign);
                this.existingLikeDetails = res.data.websiteDesign.likesDislikes;
                this.platform = res.data.websiteDesign.platform;
                this.websiteImprove = res.data.websiteDesign.websiteImprove;
                this.contentData = res.data.websiteDesign.contentReady;
                if (this.contentData == 'Yes') {
                    this.contentUploadShow = true;
                    this.docAttr = res.data.websiteDesign.contentFile[0];
                }
                this.ecommerceNeed = res.data.websiteDesign.needECommerce;
                res.data.websiteDesign.likesDislikes.forEach((element) => {
                    this.addExisting(element.existingLike);
                });
                if (!res.data.websiteDesign.likesDislikes.length) {
                    this.addExisting('');
                }
                this.colorDetails = res.data.websiteDesign.brandBook;
                res.data.websiteDesign.brandBook.forEach((element) => {
                    this.addColor(element.color, element.font);
                });
                if (!res.data.websiteDesign.brandBook.length) {
                    this.addColor('');
                }
                this.keywordsDetails = res.data.websiteDesign.keywordsList;
                res.data.websiteDesign.keywordsList.forEach((element) => {
                    this.addkeywords(element.keywordsList);
                });
                if (!res.data.websiteDesign.keywordsList.length) {
                    this.addkeywords('');
                }
                this.other = res.data.websiteDesign.homePageNeed.other;
                if (res.data.websiteDesign.homePageNeed.other.lenth != 0) {
                    this.otherFeaturesShow = true;
                }

                res.data.websiteDesign.homePageNeed.other.forEach((element) => {
                    this.addFeature(element.feature);
                });
                if (!res.data.websiteDesign.homePageNeed.other.length) {
                    this.addFeature('');
                }
                this.additionalDetails =
                    res.data.websiteDesign.addServices.additionalDetails;
                if (res.data.websiteDesign.addServices.additionalDetails != 0) {
                    this.otherServiceShow = true;
                }

                res.data.websiteDesign.addServices.additionalDetails.forEach(
                    (element) => {
                        this.addadditional(element.service);
                    }
                );
                if (
                    !res.data.websiteDesign.addServices.additionalDetails.length
                ) {
                    this.addadditional('');
                }
                this.others = res.data.websiteDesign.pagesNeed?.others;
                this.servicesPageList =
                    res.data.websiteDesign.pagesNeed.services;
                this.servicesPageList.forEach((element, index) => {
                    this.addServices(element.service);
                    element.subService.forEach((ele) => {
                        this.addSubService(index, ele.subService);
                    });
                });
                this.otherCheck = res.data.websiteDesign.pagesNeed?.others;
                res.data.websiteDesign.pagesNeed.others?.forEach((element) => {
                    this.addPage(element.page);
                });
                this.referenceDetails = res.data.websiteDesign.referenceWebsite;
                res.data.websiteDesign.referenceWebsite.forEach((element) => {
                    this.addRefer(element.url, element.liked);
                });
                if (!res.data.websiteDesign.referenceWebsite.length) {
                    this.addRefer('');
                }
                let pagesData = Object.keys(
                    res.data.websiteDesign.pagesNeed.pages
                );
                this.checkedPages = res.data.websiteDesign.pagesNeed.pages;
                this.checkPagesList.forEach((element) => {
                    pagesData.forEach((ele) => {
                        if (ele == element.name) {
                            element.checked = true;
                        }
                    });
                });
                let homepagesData = Object.keys(
                    res.data.websiteDesign.homePageNeed.homePage
                );
                this.checkedHomeNeeds =
                    res.data.websiteDesign.homePageNeed.homePage;
                this.homePagesList.forEach((element) => {
                    homepagesData.forEach((ele) => {
                        if (ele == element.name) {
                            element.checked = true;
                        }
                    });
                });
                let additionalData = Object.keys(
                    res.data.websiteDesign.addServices.services
                );
                this.checkedAdditional =
                    res.data.websiteDesign.addServices.services;
                this.additionalServicesList.forEach((element) => {
                    additionalData.forEach((ele) => {
                        if (ele == element.name) {
                            element.checked = true;
                        }
                    });
                });
                if (res.data.websiteDesign.homePageNeed.header.length != 0) {
                    this.headerShow = true;
                    this.homePagesList.forEach((element) => {
                        element.children?.forEach((ele) => {
                            res.data.websiteDesign.homePageNeed.header.forEach(
                                (a) => {
                                    if (a == ele.name) {
                                        ele.checked = true;
                                    }
                                }
                            );
                        });
                    });
                }
                if (
                    res.data.websiteDesign.homePageNeed.socialMedia.length != 0
                ) {
                    this.iconShow = true;
                    this.homePagesList.forEach((element) => {
                        element.children?.forEach((ele) => {
                            res.data.websiteDesign.homePageNeed.socialMedia.forEach(
                                (a) => {
                                    if (a == ele.name) {
                                        ele.checked = true;
                                    }
                                }
                            );
                        });
                    });
                }
                if (
                    res.data.websiteDesign.hostPassword ||
                    res.data.websiteDesign.hostUrl ||
                    res.data.websiteDesign.hostUserName
                ) {
                    this.hostingData = 'Yes';
                    this.hostShow = true;
                } else {
                    this.hostingData = 'No';
                    this.hostShow = false;
                }
                if (
                    res.data.websiteDesign.domainPassword ||
                    res.data.websiteDesign.domainUserName
                ) {
                    this.domainData = 'Yes';
                    this.domainShow = true;
                } else {
                    this.domainData = 'No';
                    this.domainShow = false;
                }

                this.modifyPagesNeed = res.data.websiteDesign.pagesNeed;
                this.modifyAdditinaolServices =
                    res.data.websiteDesign.addServices;
                this.modifyHomeNeeds = res.data.websiteDesign.homePageNeed;
            });
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
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

    fileSelectedImage(event: any) {
        const file = Math.round(event.target.files[0].size / 1024);
        if (file > 10240) {
            this.snackBar.open('Image size not more than 10mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        this.file = event.target.files[0];

        this.imageAttr = this.file.name;
        let formData = new FormData();
        formData.append('file', this.file);
        this.adminService.commonUpload(formData).subscribe((res: any) => {
            this.image = res.data.upload[0];
        });
    }
    fileSelectedDoc(event: any) {
        const file = Math.round(event.target.files[0].size / 1024);
        if (file > 10240) {
            this.snackBar.open('File size not more than 10mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        this.file = event.target.files[0];

        this.docAttr = this.file.name;

        let formData = new FormData();
        for (let i = 0; i < event.target.files.length; i++) {
            formData.append('file', event.target.files[i]);
        }

        this.adminService.commonUpload(formData).subscribe((res: any) => {
            this.contectDoc = res.data.upload;
        });
    }
    fileSelectedOther(event: any) {
        const file = Math.round(event.target.files[0].size / 1024);
        if (file > 10240) {
            this.snackBar.open('File size not more than 10mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        this.file = event.target.files[0];

        this.otherAttr = this.file.name;
        let formData = new FormData();
        for (let i = 0; i < event.target.files.length; i++) {
            formData.append('file', event.target.files[i]);
        }

        this.adminService.commonUpload(formData).subscribe((res: any) => {
            this.otherDocuments = res.data.upload;
        });
    }
    createItem(val?, a?): FormGroup {
        return this.fs.group({
            url: [val],
            liked: [a],
        });
    }
    addRefer(val?, a?) {
        this.referenceDetails = this.referenceUrlForm.get(
            'referenceDetails'
        ) as FormArray;
        this.referenceDetails.push(this.createItem(val, a));
    }
    deleteRefer(i: any) {
        if (this.referenceDetails.length != 1) {
            const remove = this.referenceUrlForm.get(
                'referenceDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createPageItem(val?): FormGroup {
        return this.fs.group({
            page: [val],
        });
    }
    addPage(val?) {
        this.others = this.pagesForm.get('others') as FormArray;
        this.others.push(this.createPageItem(val));
    }
    deletePage(i: any) {
        // if (this.others.length != 1) {
        const remove = this.pagesForm.get('others') as FormArray;
        remove.removeAt(i);
        //}
    }
    selectedDate(e: any) {
        this.launchingDate = this.datePipe.transform(
            e.target.value,
            'yyyy-MM-dd'
        );
    }

    createFeatureItem(val?): FormGroup {
        return this.fs.group({
            feature: [val],
        });
    }
    addFeature(val?) {
        this.other = this.featuresForm.get('other') as FormArray;
        this.other.push(this.createFeatureItem(val));
    }
    deleteFeature(i: any) {
        if (this.other.length != 1) {
            const remove = this.featuresForm.get('other') as FormArray;
            remove.removeAt(i);
        }
    }
    createColorItem(val?, a?): FormGroup {
        return this.fs.group({
            color: [val],
            font: [a],
        });
    }
    addColor(val?, a?) {
        this.colorDetails = this.colorForm.get('colorDetails') as FormArray;
        this.colorDetails.push(this.createColorItem(val, a));
    }
    deleteColor(i: any) {
        if (this.colorDetails.length != 1) {
            const remove = this.colorForm.get('colorDetails') as FormArray;
            remove.removeAt(i);
        }
    }
    createKeywordItem(val?): FormGroup {
        return this.fs.group({
            keywordsList: [val],
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
    createExistingItem(val?): FormGroup {
        return this.fs.group({
            existingLike: [val],
        });
    }
    addExisting(val?) {
        this.existingLikeDetails = this.existingLikeForm.get(
            'existingLikeDetails'
        ) as FormArray;
        this.existingLikeDetails.push(this.createExistingItem(val));
    }
    deleteExisting(i: any) {
        if (this.existingLikeDetails.length != 1) {
            const remove = this.existingLikeForm.get(
                'existingLikeDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createAdditionalItem(val?): FormGroup {
        return this.fs.group({
            service: [val],
        });
    }
    addadditional(val?) {
        this.additionalDetails = this.additionalForm.get(
            'additionalDetails'
        ) as FormArray;
        this.additionalDetails.push(this.createAdditionalItem(val));
    }
    deleteadditional(i: any) {
        if (this.additionalDetails.length != 1) {
            const remove = this.additionalForm.get(
                'additionalDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    handleChange(e: any) {
        this.contentData = e.value;
        if (e.value == 'Yes') {
            this.contentUploadShow = true;
        } else {
            this.contentUploadShow = false;
        }
    }
    handleChangeHost(e: any) {
        if (e.value == 'Yes') {
            this.hostShow = true;
        } else {
            this.hostShow = false;
        }
    }
    handleChangeDomain(e: any) {
        this.domainData = e.value;
        if (e.value == 'Yes') {
            this.domainShow = true;
        } else {
            this.domainShow = false;
        }
    }
    handleChangeCommerce(e: any) {
        this.ecommerceNeed = e.value;
    }
    getAge(e: any) {
        this.audienceList = e;
    }
    checkPlatform(e: any) {
        if (e.value == 'Other') {
            this.otherShow = true;
            this.platform = '';
        } else {
            this.otherShow = false;
        }
        this.platform = e.value;
    }
    checkAdditional(e: any, val: any) {
        const checkedValues = this.additionalServicesList.filter(
            (item) => item.checked
        );
        this.checkedAdditional = {};

        checkedValues.forEach((item) => {
            this.checkedAdditional[item.name] = true;
        });
        if (e == true && val == 'other') {
            this.otherServiceShow = true;
        }
        if (e == false && val == 'other') {
            this.otherServiceShow = false;
        }
    }
    checkPages(e: any, val: any) {
        const checkedValues = this.checkPagesList.filter(
            (item) => item.checked
        );
        this.checkedPages = {};

        checkedValues.forEach((item) => {
            this.checkedPages[item.name] = true;
        });

        if (e == true && val == 'servicePage') {
            this.servicesList = {
                servicePage: true,
            };
        }
    }
    checkFeatures(e: any, val: any) {
        const checkedValues = this.homePagesList.filter((item) => item.checked);
        this.checkedHomeNeeds = {};

        checkedValues.forEach((item) => {
            this.checkedHomeNeeds[item.name] = true;
        });

        if (e == true && val == 'other') {
            this.otherFeaturesShow = true;
        }
        if (e == false && val == 'other') {
            this.otherFeaturesShow = false;
        }
        //  alert(e + val);
        if (e == true && val == 'socialMediaIcons') {
            this.iconShow = true;
        }
        if (e == false && val == 'socialMediaIcons') {
            this.iconShow = false;
        }
        if (e == true && val == 'headerBanner') {
            this.headerShow = true;
        }
        if (e == false && val == 'headerBanner') {
            this.headerShow = false;
        }
    }
    checkSubHeaderFeatures(e: any, val: any) {
        if (e == true) {
            this.featuresArray.push(val);
        } else {
            this.featuresArray.forEach((element, index) => {
                if (element == val) {
                    this.featuresArray.splice(index, 1);
                }
            });
        }
        this.headerCheck = {
            header: this.featuresArray,
        };
    }
    checkSubSocialFeatures(e: any, val: any) {
        if (e == true) {
            this.featuresSocialArray.push(val);
        } else {
            this.featuresSocialArray.forEach((element, index) => {
                if (element == val) {
                    this.featuresSocialArray.splice(index, 1);
                }
            });
        }
        this.socialCheck = {
            socialMedia: this.featuresSocialArray,
        };
    }
    checkwebsite(e: any) {
        this.websiteImprove = e.value;
    }

    services(): FormArray {
        return this.serviceForm.get('services') as FormArray;
    }

    newEmployee(service?): FormGroup {
        return this.fs.group({
            service: service,
            subService: this.fs.array([]),
        });
    }

    addServices(service?) {
        this.services().push(this.newEmployee(service));
    }

    removeService(empIndex: number) {
        this.services().removeAt(empIndex);
    }

    employeeSkills(empIndex: number): FormArray {
        return this.services().at(empIndex).get('subService') as FormArray;
    }

    newSkill(subservice?): FormGroup {
        return this.fs.group({
            subService: subservice,
        });
    }

    addSubService(empIndex: number, subservice?) {
        this.employeeSkills(empIndex).push(this.newSkill(subservice));
    }

    removeSubService(empIndex: number, skillIndex: number) {
        this.employeeSkills(empIndex).removeAt(skillIndex);
    }
    uploadLogoImage(val: any) {
        const addImage = this.matDialog.open(CommonUploadModalComponent, {
            width: '35rem',
            height: '250px',
            data: {
                Data: cloneDeep(val),
            },
        });
        addImage.afterClosed().subscribe((result) => {
            if (result != '') {
                if (result) {
                    if (val == 'logo') {
                        this.image = result;
                        this.imageAttr = this.image;
                    }
                    if (val == 'content') {
                        this.contectDoc = result;
                        this.docAttr = this.contectDoc;
                    }
                    if (val == 'other') {
                        this.otherDocuments = result;
                        this.otherAttr = this.otherDocuments;
                    }
                }
            }
        });
    }
    save() {
        let obj;
        if (this.modify) {
            obj = {
                websiteId: this.websiteId,
                ...this.websiteDesignForm.value,
                logoImage: this.image,

                likesDislikes: this.existingLikeDetails.value,
                brandBook: this.colorDetails.value,
                // keywordsList: this.keywordsDetails.value,
                referenceWebsite: this.referenceDetails.value,
                contentReady: this.contentData ? this.contentData : false,
                contentFile: this.contectDoc,
                platform: this.platform
                    ? this.platform
                    : this.websiteDesignForm.value.platform,
                needECommerce: this.ecommerceNeed,
                otherDoc: this.otherDocuments,
                launchingDate: this.launchingDate,
                websiteImprove: this.websiteImprove,
                pagesNeed: {
                    pages: this.checkedPages
                        ? this.checkedPages
                        : this.modifyPagesNeed.pages,
                    ...this.pagesForm.value,
                    ...this.serviceForm.value,
                },
                homePageNeed: {
                    homePage: this.checkedHomeNeeds
                        ? this.checkedHomeNeeds
                        : this.modifyHomeNeeds.homePage,
                    header: this.headerCheck
                        ? this.headerCheck
                        : this.modifyHomeNeeds.header,
                    ...this.featuresForm.value,
                    socialMedia: this.socialCheck
                        ? this.socialCheck
                        : this.modifyHomeNeeds.socialMedia,
                },
                addServices: {
                    services: this.checkedAdditional
                        ? this.checkedAdditional
                        : this.modifyAdditinaolServices.services,
                    ...this.additionalForm.value,
                },
            };
        } else {
            obj = {
                ...this.websiteDesignForm.value,
                logoImage: this.image,

                likesDislikes: this.existingLikeDetails.value,
                brandBook: this.colorDetails.value,
                ///keywordsList: this.keywordsDetails.value,
                referenceWebsite: this.referenceDetails.value,
                contentReady: this.contentData ? this.contentData : false,
                contentFile: this.contectDoc,
                platform: this.platform
                    ? this.platform
                    : this.websiteDesignForm.value.platform,
                needECommerce: this.ecommerceNeed,
                otherDoc: this.otherDocuments,
                launchingDate: this.launchingDate,
                websiteImprove: this.websiteImprove,
                pagesNeed: {
                    pages: this.checkedPages,
                    ...this.servicesList,
                    ...this.serviceForm.value,
                    ...this.pagesForm.value,
                },
                homePageNeed: {
                    homePage: this.checkedHomeNeeds,
                    ...this.headerCheck,
                    ...this.socialCheck,
                    ...this.featuresForm.value,
                },
                addServices: {
                    services: this.checkedAdditional,
                    ...this.additionalForm.value,
                },
                createdBy: this.loginUser,
            };
        }

        console.log('obj', obj);

        this.adminService.createWebsiteDesign(obj).subscribe(
            (res: any) => {
                if (this.modify) {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.router.navigateByUrl('/website');
                } else {
                    this.successMsgShow = true;
                    this.websiteDesignForm.reset();
                    this.existingLikeForm.reset();
                    this.colorForm.reset();
                    this.referenceUrlForm.reset();
                    this.existingLikeForm.value.existingLikeDetails.forEach(
                        (element, index) => {
                            this.deleteExisting(index);
                        }
                    );
                    this.colorForm.value.colorDetails.forEach(
                        (element, index) => {
                            this.deleteColor(index);
                        }
                    );
                    this.referenceUrlForm.value.referenceDetails.forEach(
                        (element, index) => {
                            this.deleteRefer(index);
                        }
                    );
                    setTimeout(() => {
                        if (
                            this.loginUser != undefined ||
                            this.loginUser != null
                        ) {
                            this.router.navigateByUrl('/website');
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
