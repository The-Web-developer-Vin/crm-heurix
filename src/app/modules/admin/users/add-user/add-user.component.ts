/* eslint-disable no-var */
/* eslint-disable prefer-const */
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
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { Editor, toHTML, Toolbar } from 'ngx-editor';

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'DD MMM YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};
@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AddUserComponent implements OnInit {
    createForm!: FormGroup;
    oldData: any;
    modify: boolean = false;
    modifyData: any = this.data;
    streamOptions: boolean = false;
    submitted = false;
    streambackend: any = [];
    streamFrnt: any = [];
    streamCms: any = [];
    getTechnologylist: any = [];
    streams: any = [];

    imageAttr = 'Profile Picture';
    file: File;
    technologyArray: any;
    technologyids: any = [];
    // getTechnologylist: any = [];
    selectGender: any = 'Mr';
    // selectedDOJ: any;
    // selectedResign: string;
    // selectedReliev: string;
    editor: Editor;
    html: any;
    htmlTexEditor: string;
    addr_req: boolean = false;
    experienceShow: boolean = false;
    expValue: any;
    letters = [
        { name: 'Offer Letter', value: 'Offer Letter' },
        { name: 'Experience Letter', value: 'Experience Letter' },
        { name: 'Relieving Letter', value: 'Relieving Letter' },
    ];
    letterArrayValues: any = [];
    letterArray: any;
    test: any;
    constructor(
        private matDialog: MatDialog,
        private dailogRef: MatDialogRef<AddUserComponent>,
        private snackBar: MatSnackBar,
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {
        // this.getStream();
        this.createForm = new FormGroup({
            name: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            lastName: new FormControl('', Validators.required),
            technology: new FormControl('', Validators.required),
            // empId: new FormControl('', Validators.required),
            date_of_join: new FormControl('', Validators.required),
            role: new FormControl('', Validators.required),

            city: new FormControl(''),
            address: new FormControl(''),

            image: new FormControl(''),
            gender: new FormControl('', Validators.required),
            phoneNumber: new FormControl(''),
            alternativeNumber: new FormControl(''),
            nameTitle: new FormControl('', Validators.required),
            certificateOriginal: new FormControl(false),
            aadharCard: new FormControl(false),
            panCard: new FormControl(false),
            voterCard: new FormControl(false),
            drivingLicense: new FormControl(false),
            certificateXerox: new FormControl(false),

            collegeName: new FormControl(''),
            course: new FormControl(''),
            passedYear: new FormControl(''),
            experience: new FormControl(false),
            experienceYrs: new FormControl(''),
            previousCompany: new FormControl(''),
            experiencedCertificate: new FormControl(''),
        });
        if (this.modifyData) {
            this.modify = true;
            console.log('modify', this.modifyData);
            this.createForm.patchValue(this.modifyData.Data);
            this.html = this.modifyData.Data.address;

            this.technologyids = this.modifyData.Data.technology.map(
                (technology) => technology._id
            );

            this.selectGender = this.modifyData.Data.nameTitle;

            this.imageAttr = this.modifyData.Data.image;
            this.createForm.patchValue({
                technology: this.technologyids,
                // relievingDate: this.modifyData.Data.relievingDate,
                // resignationDate: this.modifyData.Data.resignationDate,
                nameTitle: this.selectGender,

                // image:this.modifyData.Data.image,
            });

            if (this.modifyData.Data?.experience == true) {
                this.experienceShow = true;
                this.createForm.value.experience = true;
                this.letterArray = this.modifyData.Data.experiencedCertificate;
                this.createForm.patchValue({
                    experienceYrs: this.modifyData.Data.experienceYrs,
                    previousCompany: this.modifyData.Data.previousCompany,
                });
            } else {
                this.createForm.value.experience = false;
            }
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
    }

    cheeckExperience(e) {
        console.log('dk', e.checked);
        if (e.checked == true) {
            this.experienceShow = true;
        } else {
            this.experienceShow = false;
        }
        this.createForm.value.experience = e.checked;
    }
    ngOnInit(): void {
        this.editor = new Editor();
        this.getTechnologyList();
    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    close() {
        this.dailogRef.close('close');
    }
    selectTechnology(e: any) {
        this.technologyArray = e.value;
    }
    getTechnologyList() {
        this.adminservice.getStream('').subscribe((res: any) => {
            this.getTechnologylist = res.data[0].data;
        });
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    showOptions(e: any) {
        console.log(e);
        if (e.checked === true) {
            this.streamOptions = true;
        } else {
            this.streamOptions = false;
        }
        this.streams.push(e.source.value);
    }
    check(val) {
        let check = this.streams.find((data: any) => data == val);
        return check ? true : false;
    }
    checkCertificate(e: any, value: any) {
        if (value == '10th-xerox') {
            this.createForm.value.certificateXerox = e;
        } else if (value == 'aadhar') {
            this.createForm.value.aadharCard = e;
        } else if (value == 'pan') {
            this.createForm.value.panCard = e;
        } else if (value == 'voter') {
            this.createForm.value.voterCard = e;
        } else if (value == 'driving') {
            this.createForm.value.drivingLicense = e;
        } else if (value == '10th') {
            this.createForm.value.certificateOriginal = e;
        }
        //  else if (value == 'offer') {
        //     this.createForm.value.offerLetter = e;
        // } else if (value == 'experience') {
        //     this.createForm.value.experienceLetter = e;
        // } else if (value == 'relieving') {
        //     this.createForm.value.relievingLetter = e;
        // }
    }
    getGender(e: any) {
        this.selectGender = e;
    }
    editorChange(e: any) {
        this.htmlTexEditor = toHTML(this.html);
    }
    selectLetters(value: any) {
        this.letterArray = value.value;
    }
    save() {
        this.submitted = true;

        if (this.createForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            if (this.modifyData.Data.address) {
                this.addr_req = false;
            } else {
                this.addr_req = true;
            }

            return;
        }
        if (this.createForm.value.date_of_join._d) {
            this.createForm.value.date_of_join =
                this.createForm.value.date_of_join._d;
            var d = new Date(this.createForm.value.date_of_join);
            var month = '' + (d.getMonth() + 1);
            var day = '' + d.getDate();
            var year = d.getFullYear();

            if (month.length < 2) {
                month = '0' + month;
            }
            if (day.length < 2) {
                day = '0' + day;
            }
            this.createForm.value.date_of_join = [year, month, day].join('-');
        }

        if (this.modifyData) {
            let formData = new FormData();

            if (this.file) {
                formData.append('employeeId', this.modifyData.Data._id);
                formData.append('name', this.createForm.value.name);
                formData.append('email', this.createForm.value.email);
                formData.append('lastName', this.createForm.value.lastName);
                formData.append('image', this.file ? this.file : '');

                for (var i = 0; i < this.technologyArray?.length; i++) {
                    formData.append('technology', this.technologyArray[i]);
                }
                formData.append('empId', this.createForm.value.empId);
                formData.append(
                    'date_of_join',
                    this.createForm.value.date_of_join
                );
                formData.append('role', this.createForm.value.role);
                formData.append('city', this.createForm.value.city);
                // formData.append('address', this.createForm.value.address);
                formData.append(
                    'address',
                    this.html ? this.html : this.htmlTexEditor
                );
                formData.append(
                    'phoneNumber',
                    this.createForm.value.phoneNumber
                );

                formData.append('gender', this.createForm.value.gender);
                formData.append(
                    'alternativeNumber',
                    this.createForm.value.alternativeNumber
                        ? this.createForm.value.alternativeNumber
                        : ''
                );
                formData.append('nameTitle', this.selectGender);
                formData.append(
                    'certificateOriginal',
                    this.createForm.value.certificateOriginal
                );
                formData.append('aadharCard', this.createForm.value.aadharCard);
                formData.append('panCard', this.createForm.value.panCard);
                formData.append('voterCard', this.createForm.value.voterCard);
                formData.append(
                    'drivingLicense',
                    this.createForm.value.drivingLicense
                );
                formData.append(
                    'certificateXerox',
                    this.createForm.value.certificateXerox
                );
                formData.append(
                    'collegeName',
                    this.createForm.value.collegeName
                );
                formData.append('course', this.createForm.value.course);
                formData.append('passedYear', this.createForm.value.passedYear);
                formData.append(
                    'experience',
                    this.createForm.value.experience
                        ? this.createForm.value.experience
                        : false
                );

                formData.append(
                    'experienceYrs',
                    this.createForm.value.experienceYrs
                );
                formData.append(
                    'previousCompany',
                    this.createForm.value.previousCompany
                        ? this.createForm.value.previousCompany
                        : ''
                );
                for (var i = 0; i < this.letterArray?.length; i++) {
                    formData.append(
                        'experiencedCertificate',
                        this.letterArray[i]
                    );
                }
            } else {
                formData.append('employeeId', this.modifyData.Data._id);
                formData.append('name', this.createForm.value.name);
                formData.append('email', this.createForm.value.email);
                formData.append('lastName', this.createForm.value.lastName);
                formData.append('image', this.createForm.value.image);

                for (var i = 0; i < this.technologyArray?.length; i++) {
                    formData.append('technology', this.technologyArray[i]);
                }
                formData.append('empId', this.createForm.value.empId);
                formData.append(
                    'date_of_join',
                    this.createForm.value.date_of_join
                );
                formData.append('role', this.createForm.value.role);
                formData.append('city', this.createForm.value.city);
                //formData.append('address', this.createForm.value.address);
                formData.append(
                    'address',
                    this.html ? this.html : this.htmlTexEditor
                );

                formData.append('gender', this.createForm.value.gender);
                formData.append(
                    'phoneNumber',
                    this.createForm.value.phoneNumber
                );
                formData.append(
                    'alternativeNumber',
                    this.createForm.value.alternativeNumber
                        ? this.createForm.value.alternativeNumber
                        : ''
                );

                formData.append('nameTitle', this.selectGender);
                formData.append(
                    'certificateOriginal',
                    this.createForm.value.certificateOriginal
                        ? this.createForm.value.certificateOriginal
                        : false
                );
                formData.append(
                    'aadharCard',
                    this.createForm.value.aadharCard
                        ? this.createForm.value.aadharCard
                        : false
                );
                formData.append(
                    'panCard',
                    this.createForm.value.panCard
                        ? this.createForm.value.panCard
                        : false
                );
                formData.append(
                    'voterCard',
                    this.createForm.value.voterCard
                        ? this.createForm.value.voterCard
                        : false
                );
                formData.append(
                    ' drivingLicense',
                    this.createForm.value.drivingLicense
                        ? this.createForm.value.drivingLicense
                        : false
                );
                formData.append(
                    'certificateXerox',
                    this.createForm.value.certificateXerox
                        ? this.createForm.value.certificateXerox
                        : false
                );
                formData.append(
                    'collegeName',
                    this.createForm.value.collegeName
                );
                formData.append('course', this.createForm.value.course);
                formData.append('passedYear', this.createForm.value.passedYear);
                formData.append(
                    'experience',
                    this.createForm.value.experience
                        ? this.createForm.value.experience
                        : false
                );

                formData.append(
                    'experienceYrs',
                    this.createForm.value.experienceYrs
                );
                formData.append(
                    'previousCompany',
                    this.createForm.value.previousCompany
                        ? this.createForm.value.previousCompany
                        : ''
                );
                for (var i = 0; i < this.letterArray?.length; i++) {
                    formData.append(
                        'experiencedCertificate',
                        this.letterArray[i]
                    );
                }
            }
            this.spinner.show();
            this.adminservice.editEmployee(formData).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.createForm.value.name = '';
                    this.createForm.reset();
                    this.dailogRef.close('submit');
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
            let formData = new FormData();
            formData.append('name', this.createForm.value.name);
            formData.append('email', this.createForm.value.email);
            formData.append('lastName', this.createForm.value.lastName);
            formData.append('image', this.file ? this.file : '');
            // let technologyArray:any=[]
            // technologyArray.push(this.createForm.value.technology)
            // console.log("technologyArray",technologyArray)
            // formData.append('technology', this.technologyArray);
            for (var i = 0; i < this.technologyArray.length; i++) {
                formData.append('technology', this.technologyArray[i]);
            }
            formData.append('empId', this.createForm.value.empId);
            formData.append('date_of_join', this.createForm.value.date_of_join);
            formData.append('role', this.createForm.value.role);
            formData.append('city', this.createForm.value.city);
            //formData.append('address', this.createForm.value.address);
            formData.append('address', this.htmlTexEditor);

            formData.append('gender', this.createForm.value.gender);
            formData.append('phoneNumber', this.createForm.value.phoneNumber);
            formData.append(
                'alternativeNumber',
                this.createForm.value.alternativeNumber
            );
            formData.append('nameTitle', this.selectGender);
            formData.append(
                'certificateOriginal',
                this.createForm.value.certificateOriginal
                    ? this.createForm.value.certificateOriginal
                    : false
            );
            formData.append(
                'aadharCard',
                this.createForm.value.aadharCard
                    ? this.createForm.value.aadharCard
                    : false
            );
            formData.append(
                'panCard',
                this.createForm.value.panCard
                    ? this.createForm.value.panCard
                    : false
            );
            formData.append(
                'voterCard',
                this.createForm.value.voterCard
                    ? this.createForm.value.voterCard
                    : false
            );
            formData.append(
                'drivingLicense',
                this.createForm.value.drivingLicense
                    ? this.createForm.value.drivingLicense
                    : false
            );
            formData.append(
                'certificateXerox',
                this.createForm.value.certificateXerox
                    ? this.createForm.value.certificateXerox
                    : false
            );

            formData.append(
                'collegeName',
                this.createForm.value.collegeName
                    ? this.createForm.value.collegeName
                    : ''
            );
            formData.append(
                'course',
                this.createForm.value.course ? this.createForm.value.course : ''
            );
            formData.append(
                'passedYear',
                this.createForm.value.passedYear
                    ? this.createForm.value.passedYear
                    : ''
            );
            formData.append(
                'experience',
                this.createForm.value.experience
                    ? this.createForm.value.experience
                    : false
            );

            formData.append(
                'experienceYrs',
                this.createForm.value.experienceYrs
                    ? this.createForm.value.experienceYrs
                    : ''
            );
            formData.append(
                'previousCompany',
                this.createForm.value.previousCompany
                    ? this.createForm.value.previousCompany
                    : ''
            );
            for (var i = 0; i < this.letterArray?.length; i++) {
                formData.append('experiencedCertificate', this.letterArray[i]);
            }
            this.spinner.show();
            this.adminservice.addEmployee(formData).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.dailogRef.close('submit');
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

        // }
    }
}
