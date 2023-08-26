import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-add-trainee',
    templateUrl: './add-trainee.component.html',
    styleUrls: ['./add-trainee.component.scss'],
})
export class AddTraineeComponent implements OnInit {
    createForm!: FormGroup;
    modify: boolean = false;
    getTechnologylist: any = [];
    technologyArray: any;
    imageAttr = 'Profile Picture';
    file: File;
    selectedCourseValue: any;
    selectGender: any = 'Mr';
    courses: any = [];
    feeAmount: any;
    modifyData: any = this.data;
    technologyids: any = [];
    dates: boolean = false;
    timeLines: any;
    constructor(
        private matDialog: MatDialog,
        private dialogRef: MatDialogRef<AddTraineeComponent>,
        private snackBar: MatSnackBar,
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        this.createForm = new FormGroup({
            name: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            surname: new FormControl('', Validators.required),
            technology: new FormControl('', Validators.required),
            traineeId: new FormControl('', Validators.required),
            joiningDate: new FormControl('', Validators.required),
            course: new FormControl('', Validators.required),
           
            city: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
           
            image: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
            mobileNumber: new FormControl('', Validators.required),
            alternativeNumber: new FormControl(''),
            nameTitle: new FormControl('', Validators.required),
            collegeName: new FormControl('', Validators.required),
            referenceName: new FormControl(''),
            referenceNumber: new FormControl(''),
            courseFee: new FormControl(''),
            discountNumber: new FormControl(''),
            fatherName: new FormControl('', Validators.required),
           
        });
        if (this.modifyData) {
            this.modify = true;
            console.log('modify', this.modifyData);
            this.createForm.patchValue(this.modifyData.Data);

            // this.technologyids = this.modifyData.Data.technology.map(
            //     (technology) => technology._id
            // );
            this.selectGender = this.modifyData.Data.nameTitle;
            this.technologyArray = this.modifyData.Data.technology;
            this.file = this.modifyData.Data.image;
            this.imageAttr = this.modifyData.Data.image;
            this.createForm.patchValue({
                // technology: this.technologyids,
                course: this.modifyData.Data.course._id,
                nameTitle: this.selectGender,
                traineeId: this.modifyData.Data.traineeId,
            });
           
        }
        this.getCourses();
        this.getCourseTechnoList();
        this.getTraineeCount();
    }
    close() {
        this.dialogRef.close('close');
    }
    
    selectTechnology(e: any) {
        this.technologyArray = e.value;
    }
    fileSelectedImage(event: any) {
        console.log(event.target.files[0]);
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
    getGender(e: any) {
        this.selectGender = e;
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    getCourses() {
        this.adminservice.getTraineeCourses().subscribe((res: any) => {
            console.log('fdgg', res);
            this.courses = res.data.course;
        });
    }
    getTraineeCount() {
        if (this.modifyData == null) {
            this.adminservice.getTraineeCount().subscribe((res: any) => {
                if (res.data.trainee <= 9) {
                    this.createForm
                        .get('traineeId')
                        ?.setValue('VIN' + '00' + (res.data.trainee + 1));
                } else if (res.data.trainee > 9) {
                    this.createForm
                        .get('traineeId')
                        ?.setValue('VIN' + '0' + (res.data.trainee + 1));
                } else if (res.data.trainee > 99) {
                    this.createForm
                        .get('traineeId')
                        ?.setValue('VIN' + (res.data.trainee + 1));
                }
            });
        }
    }
    getCourseTechnoList() {
        this.adminservice.getTraineeTechnology('').subscribe((res: any) => {
            this.getTechnologylist = res.data[0].data;
        });
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
            let formData = new FormData();
            formData.append('id', this.modifyData.Data._id);
            formData.append('nameTitle', this.selectGender);
            formData.append('name', this.createForm.value.name);
            formData.append('surname', this.createForm.value.surname);
            formData.append('email', this.createForm.value.email);
            formData.append('joiningDate', this.createForm.value.joiningDate);
            formData.append('traineeId', this.createForm.value.traineeId);
            formData.append('course', this.createForm.value.course);
            for (var i = 0; i < this.technologyArray.length; i++) {
                formData.append('technology', this.technologyArray[i]);
            }

            formData.append('gender', this.createForm.value.gender);
            formData.append('mobileNumber', this.createForm.value.mobileNumber);
            formData.append(
                'alternativeNumber',
                this.createForm.value.alternativeNumber
                    ? this.createForm.value.alternativeNumber
                    : ''
            );
            formData.append('city', this.createForm.value.city);
            formData.append('address', this.createForm.value.address);
            formData.append('collegeName', this.createForm.value.collegeName);
            formData.append(
                'referenceName',
                this.createForm.value.referenceName
            );
            formData.append(
                'referenceNumber',
                this.createForm.value.referenceNumber
            );
            formData.append('courseFee', this.createForm.value.courseFee);
            formData.append(
                'discountNumber',
                this.createForm.value.discountNumber
            );
         
            formData.append('image', this.file);

            formData.append('fatherName', this.createForm.value.fatherName);
          
            this.spinner.show();
            this.adminservice.editTrainee(formData).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });

                    this.createForm.reset();
                    this.dialogRef.close('submit');
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
            formData.append('nameTitle', this.selectGender);
            formData.append('name', this.createForm.value.name);
            formData.append('surname', this.createForm.value.surname);
            formData.append('email', this.createForm.value.email);
            formData.append('joiningDate', this.createForm.value.joiningDate);
            formData.append('traineeId', this.createForm.value.traineeId);
            formData.append('course', this.createForm.value.course);
            for (var i = 0; i < this.technologyArray.length; i++) {
                formData.append('technology', this.technologyArray[i]);
            }
            formData.append('gender', this.createForm.value.gender);
            formData.append('mobileNumber', this.createForm.value.mobileNumber);
            formData.append(
                'alternativeNumber',
                this.createForm.value.alternativeNumber
            );
            formData.append('city', this.createForm.value.city);
            formData.append('address', this.createForm.value.address);
            formData.append('collegeName', this.createForm.value.collegeName);
            formData.append(
                'referenceName',
                this.createForm.value.referenceName
            );
            formData.append(
                'referenceNumber',
                this.createForm.value.referenceNumber
            );
            formData.append('courseFee', this.createForm.value.courseFee);
            formData.append(
                'discountNumber',
                this.createForm.value.discountNumber
            );
            formData.append('image', this.file);
            formData.append('fatherName', this.createForm.value.fatherName);

            this.spinner.show();
            this.adminservice.createTrainee(formData).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.dialogRef.close('submit');
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
    }
    courseGetById(id: any) {
        this.adminservice.getCourseById(id).subscribe((res: any) => {
            this.feeAmount = res.data.course.fee;
            this.createForm.get('courseFee')?.setValue(this.feeAmount);
        });
    }
    selectedCourse(e: any) {
        this.selectedCourseValue = e;
        this.courseGetById(e);
    }
}
