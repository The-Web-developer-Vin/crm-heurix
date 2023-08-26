/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    @ViewChild(MatPaginator) paginatorCountry: MatPaginator;
    @ViewChild(MatPaginator) paginatorhired: MatPaginator;
    @ViewChild(MatPaginator) paginatorPaid: MatPaginator;
    @ViewChild(MatPaginator) paginatorTechno: MatPaginator;
    @ViewChild(MatPaginator) paginatorCourse: MatPaginator;
    @ViewChild(MatPaginator) paginatorCourseTechno: MatPaginator;
    @ViewChild(MatPaginator) paginatorReason: MatPaginator;
    dataSourceCountry = new MatTableDataSource<Element>();
    countryColumns = ['position', 'name', 'currency', 'actions'];
    pageSizeCountry: any = 100;
    pageLengthCountry: any;
    searchCountry: any;

    dataSourceHiredIn = new MatTableDataSource<Element>();
    hiredInColumns = ['position', 'name', 'actions'];
    pageSizeHired: any = 100;
    pageLengthHired: any;
    hiredSearch: any;

    dataSourcePaid = new MatTableDataSource<Element>();
    paidColumns = ['position', 'name', 'actions'];
    pageSizePaid: any = 100;
    pageLengthPaid: any;
    paidthroghSearch: any;

    dataSourceTechnology = new MatTableDataSource<Element>();
    technologyColumns = ['position', 'name', 'category', 'actions'];
    pageSizeTechno: any = 100;
    pageLengthTechno: any;
    technologySearch: any;

    dataSourceCourse = new MatTableDataSource<Element>();
    courseColumns = [
        'position',
        'duration',
        'course',
        'fee',
        'months',
        'actions',
    ];
    pageSizeCourse: any = 100;
    pageLengthCourse: any;
    courseSearch: any;

    dataSourceCourseTechno = new MatTableDataSource<Element>();
    courseTechnoColumns = ['position', 'technology', 'actions'];
    pageSizeCourseTechno: any = 100;
    pageLengthCourseTechno: any;
    courseTechnoSearch: any;

    dataSourceReason = new MatTableDataSource<Element>();
    reasonColumns = ['position', 'reason', 'actions'];
    pageSizeReason: any = 100;
    pageLengthReason: any;
    reasonSearch: any;

    modify: boolean = false;
    modifyhired: boolean = false;
    modifyTechnology: boolean = false;
    modifyCourse: boolean = false;

    modifyData: any;
    modifyDatahired: any;

    modifyDatatechnology: any;
    createForm: FormGroup;
    createHiredForm: FormGroup;
    createPaidForm: FormGroup;
    createTechnologyForm: FormGroup;
    createCourseForm: FormGroup;
    createCourseTechnoForm: FormGroup;
    createReasonForm: FormGroup;

    modifyDataCourse: any;
    modifyCourseTechno: boolean = false;
    modifyDataCourseTechno: any;

    modifyReason: boolean = false;
    modifyDataReason: any;

    // public pageSize = 10;

    pageLength: any;
    pageNumber = 1;
    getallcoutries: any;
    getallpaids: any;
    hiredin: any;
    technologyList;
    searchKey: any;

    role: any;
    sortValue = 1;
    sortValueHired = 1;
    sortValuePaid = 1;
    sortValueTechno = 1;
    sortValueCourse = 1;
    sortValueTrainee = 1;
    sortValueReason = 1;
    sort: any;
    sortHired: any;
    sortPaid: any;
    sortTechno: any;
    sortCourse: any;
    sortTrainee: any;
    sortReason: any;
    tabName = 'Country';
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private spinner: NgxSpinnerService
    ) {
        this.createForm = new FormGroup({
            name: new FormControl('', Validators.required),
            currency: new FormControl('', Validators.required),
        });
        this.createHiredForm = new FormGroup({
            name: new FormControl('', Validators.required),
        });
        this.createPaidForm = new FormGroup({
            name: new FormControl('', Validators.required),
        });
        this.createTechnologyForm = new FormGroup({
            name: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            category: new FormControl(''),
        });
        this.createCourseForm = new FormGroup({
            duration: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            fee: new FormControl('', Validators.required),
            months: new FormControl('', Validators.required),
        });
        this.createCourseTechnoForm = new FormGroup({
            name: new FormControl('', Validators.required),
        });
        this.createReasonForm = new FormGroup({
            name: new FormControl('', Validators.required),
        });
        if (this.modifyData) {
            this.modify = true;
            this.createForm.patchValue(this.modifyData.Data);
        }
        if (this.modifyDatahired) {
            this.modifyhired = true;
            this.createHiredForm.patchValue(this.modifyDatahired.Data);
        }
        if (this.modifyDatatechnology) {
            this.modifyTechnology = true;
            this.createTechnologyForm.patchValue(
                this.modifyDatatechnology.Data
            );
        }
        if (this.modifyDataCourse) {
            this.modifyCourse = true;
            this.createCourseForm.patchValue(this.modifyDataCourse.Data);
        }
        if (this.modifyDataCourseTechno) {
            this.modifyCourseTechno = true;
            this.createCourseTechnoForm.patchValue(
                this.modifyDataCourseTechno.Data
            );
        }
        if (this.modifyDataReason) {
            this.modifyReason = true;
            this.createReasonForm.patchValue(this.modifyDataReason.Data);
        }
    }
    ngAfterViewInit() {
        this.dataSourceCountry.paginator = this.paginatorCountry;
        this.dataSourceHiredIn.paginator = this.paginatorhired;
        this.dataSourcePaid.paginator = this.paginatorPaid;
        this.dataSourceTechnology.paginator = this.paginatorTechno;
        if (this.tabName == 'Country') {
            this.getCountryDetails();
        }
    }
    ngOnInit(): void {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        // if (this.role == 'Admin') {
        //     if (this.countryColumns.length) {
        //         this.countryColumns.pop();
        //     }
        //     if (this.hiredInColumns.length) {
        //         this.hiredInColumns.pop();
        //     }
        //     if (this.paidColumns.length) {
        //         this.paidColumns.pop();
        //     }
        //     if (this.technologyColumns.length) {
        //         this.technologyColumns.pop();
        //     }
        // }
    }
    selectedTabChange(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;

        if (this.tabName == 'Country') {
            this.getCountryDetails();
        }
        if (this.tabName == 'Hired In') {
            this.gethiredIn();
        }
        if (this.tabName == 'Paid Through') {
            this.getPaidthrough();
        }
        if (this.tabName == 'Technologies') {
            this.getTechnologyList();
        }

        if (this.tabName == 'Project Stopped Reasons') {
            this.getAllStoppedReasons();
        }
        setTimeout(() => {
            switch (indexNumber) {
                case 0:
                    this.dataSourceCountry.paginator = this.paginatorCountry;
                    break;
                case 1:
                    this.dataSourceHiredIn.paginator = this.paginatorhired;
                    break;
                case 2:
                    this.dataSourcePaid.paginator = this.paginatorPaid;
                    break;
                case 3:
                    this.dataSourceTechnology.paginator = this.paginatorTechno;
                    break;
                case 4:
                    this.dataSourceCourse.paginator = this.paginatorCourse;
                    break;
                case 5:
                    this.dataSourceReason.paginator = this.paginatorReason;
            }
        }, 500);
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    doFilter(value: any) {
        this.searchCountry = value;
        this.getCountryDetails();
    }
    sorting(e: any, value: any) {
        if (this.tabName == 'Country') {
            this.sort = value;
            this.getCountryDetails();
        }
        if (this.tabName == 'Hired In') {
            this.sortHired = value;
            this.gethiredIn();
        }
        if (this.tabName == 'Paid Through') {
            this.sortPaid = value;
            this.getPaidthrough();
        }
        if (this.tabName == 'Technologies') {
            this.sortTechno = value;
            this.getTechnologyList();
        }

        if (this.tabName == 'Project Stopped Reasons') {
            this.sortReason = value;
            this.getAllStoppedReasons();
        }
    }
    // Country
    getCountryDetails() {
        if (this.sortValue == -1) {
            this.sortValue = 1;
        } else {
            this.sortValue = -1;
        }
        this.pageSizeCountry = this.paginatorCountry?.pageSize
            ? this.paginatorCountry?.pageSize
            : 100;
        this.pageNumber =
            this.paginatorCountry.pageIndex + 1
                ? this.paginatorCountry.pageIndex + 1
                : 1;
        let pageparams;
        pageparams = `?pageSize=${this.pageSizeCountry}&pageNumber=${this.pageNumber}`;
        if (this.searchCountry) {
            pageparams += `&searchKey=${this.searchCountry}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getCountries(pageparams).subscribe(
            (res: any) => {
                this.getallcoutries = res.data[0].data;
                this.dataSourceCountry = res.data[0].data;
                this.pageLengthCountry = res.data[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    editCountry(data) {
        this.modify = true;
        this.modifyData = data;
        this.createForm.patchValue(this.modifyData);
    }
    addCountry() {
        // if (this.createForm.invalid) {
        //     this.snackBar.open('Country Name is Required', 'Close', {
        //         duration: 3000,
        //         panelClass: ['alert-red'],
        //     });
        //     return;
        // }
        if (this.modifyData) {
            let obj = {
                id: this.modifyData._id,
                name: this.createForm.value.name,
                currency: this.createForm.value.currency,
            };
            this.spinner.show();
            this.adminService.updateCountry(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.createForm.value.name = '';
                    this.getCountryDetails();
                    this.createForm.reset();
                    this.modify = false;
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
            let obj = {
                name: this.createForm.value.name,
                currency: this.createForm.value.currency,
            };
            this.adminService.addCountry(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.spinner.show();

                    this.createForm.reset();
                    this.createForm.value.name = '';
                    this.createForm.value.currency = '';
                    this.createForm.get('name').setValue('');
                    this.createForm.get('currency').setValue('');
                    this.createForm.clearValidators();
                    this.getCountryDetails();
                    this.spinner.hide();
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

    deleteCountry(id: any) {
        let obj = {
            countryId: id,
        };
        this.spinner.show();
        this.adminService.deleteCountry(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.getCountryDetails();
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
            }
        );
    }

    // hired In

    doFilterHired(value: any) {
        this.hiredSearch = value;
        this.gethiredIn();
    }

    gethiredIn() {
        if (this.sortValueHired == -1) {
            this.sortValueHired = 1;
        } else {
            this.sortValueHired = -1;
        }
        this.pageSizeHired = this.paginatorhired?.pageSize
            ? this.paginatorhired?.pageSize
            : 100;
        this.pageNumber =
            this.paginatorhired.pageIndex + 1
                ? this.paginatorhired.pageIndex + 1
                : 1;
        let pageparams;
        pageparams = `?pageSize=${this.pageSizeHired}&pageNumber=${this.pageNumber}`;
        if (this.hiredSearch) {
            pageparams += `&searchKey=${this.hiredSearch}`;
        }
        if (this.sortHired) {
            pageparams += `&sort=${this.sortHired}&sortValue=${this.sortValueHired}`;
        }
        this.spinner.show();
        this.adminService.getHiredIn(pageparams).subscribe(
            (res: any) => {
                if (res.data[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.hiredin = res.data[0].data;
                this.dataSourceHiredIn = res.data[0].data;
                this.pageLengthHired = res.data[0].pagination[0].total;

                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    editHired(data) {
        this.modifyhired = true;
        this.modifyDatahired = data;

        this.createHiredForm.patchValue(this.modifyDatahired);
    }
    addHired() {
        if (this.createHiredForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        if (this.modifyDatahired) {
            let obj = {
                id: this.modifyDatahired._id,
                name: this.createHiredForm.value.name,
            };
            this.spinner.show();
            this.adminService.updateHiredIn(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.createHiredForm.value.name = '';
                    this.createHiredForm.reset();
                    this.gethiredIn();
                    this.modifyhired = false;
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
            let obj = {
                name: this.createHiredForm.value.name,
            };
            this.spinner.show();
            this.adminService.addHiredIn(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.createHiredForm.value.name = '';
                    // this.createForm.reset();
                    this.createHiredForm.get('name').setValue('');
                    this.createHiredForm.clearValidators();
                    this.gethiredIn();
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

    deleteHired(id: any) {
        let obj = {
            hiredId: id,
        };
        this.spinner.show();
        this.adminService.deleteHiredin(obj).subscribe(
            (res: any) => {
                console.log('res', res);
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.gethiredIn();
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
            }
        );
    }

    // PaidThrough
    doFilterPaid(value: any) {
        this.paidthroghSearch = value;
        this.getPaidthrough();
    }
    getPaidthrough() {
        if (this.sortValuePaid == -1) {
            this.sortValuePaid = 1;
        } else {
            this.sortValuePaid = -1;
        }
        this.pageSizePaid = this.paginatorPaid?.pageSize
            ? this.paginatorPaid?.pageSize
            : 100;
        this.pageNumber =
            this.paginatorPaid.pageIndex + 1
                ? this.paginatorPaid.pageIndex + 1
                : 1;
        let pageparams;
        pageparams = `?pageSize=${this.pageSizePaid}&pageNumber=${this.pageNumber}`;
        if (this.paidthroghSearch) {
            pageparams += `&searchKey=${this.paidthroghSearch}`;
        }
        if (this.sortPaid) {
            pageparams += `&sort=${this.sortPaid}&sortValue=${this.sortValuePaid}`;
        }
        this.spinner.show();
        this.adminService.getPaidThrough(pageparams).subscribe(
            (res: any) => {
                if (res.data[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.getallpaids = res.data[0].data;
                this.dataSourcePaid = res.data[0].data;
                this.pageLengthPaid = res.data[0].pagination[0].total;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }

    addPay() {
        if (this.createPaidForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        let obj = {
            name: this.createPaidForm.value.name,
        };
        this.spinner.show();
        this.adminService.addpaidThrough(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.createPaidForm.value.name = '';
                // this.createForm.reset();
                this.createPaidForm.get('name').setValue('');
                this.createPaidForm.clearValidators();
                this.getPaidthrough();
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
        // }
    }

    editPay() {}
    deletePay(id: any) {
        let obj = {
            paidThroughId: id,
        };
        this.spinner.show();
        this.adminService.deletepaidThrough(obj).subscribe(
            (res: any) => {
                console.log('res', res);
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.getPaidthrough();
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
            }
        );
    }
    // technology
    doFilterTechnology(value: any) {
        this.technologySearch = value;
        this.getTechnologyList();
    }
    getTechnologyList() {
        if (this.sortValueTechno == -1) {
            this.sortValueTechno = 1;
        } else {
            this.sortValueTechno = -1;
        }
        this.pageSizeTechno = this.paginatorTechno?.pageSize
            ? this.paginatorTechno?.pageSize
            : 100;
        this.pageNumber =
            this.paginatorTechno.pageIndex + 1
                ? this.paginatorTechno.pageIndex + 1
                : 1;
        let pageparams;
        pageparams = `?pageSize=${this.pageSizeTechno}&pageNumber=${this.pageNumber}`;
        if (this.technologySearch) {
            pageparams += `&searchKey=${this.technologySearch}`;
        }
        if (this.sortTechno) {
            pageparams += `&sort=${this.sortTechno}&sortValue=${this.sortValueTechno}`;
        }
        this.spinner.show();
        this.adminService.getStream(pageparams).subscribe(
            (res: any) => {
                if (res.data[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSourceTechnology = res.data[0].data;
                this.pageLengthTechno = res.data[0].pagination[0].total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    addTechnology() {
        if (this.createTechnologyForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        if (this.modifyDatatechnology) {
            let obj = {
                id: this.modifyDatatechnology._id,
                ...this.createTechnologyForm.value,
            };
            this.spinner.show();
            this.adminService.updateStream(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.getTechnologyList();
                    this.createTechnologyForm.reset();
                    this.modifyTechnology = false;
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
            this.spinner.show();
            this.adminService
                .createStream(this.createTechnologyForm.value)
                .subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });

                        this.getTechnologyList();
                        this.createTechnologyForm.reset();
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
    editTechnology(data: any) {
        this.modifyTechnology = true;
        this.modifyDatatechnology = data;

        this.createTechnologyForm.patchValue({
            category: this.modifyDatatechnology.category,
        });

        this.createTechnologyForm.patchValue(this.modifyDatatechnology);
    }
    deleteTechnology(id: any) {
        let obj = {
            technologyId: id,
        };
        this.spinner.show();
        this.adminService.deleteStream(obj).subscribe(
            (res: any) => {
                console.log('res', res);
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.getTechnologyList();
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
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

    // reasons
    getAllStoppedReasons() {
        if (this.sortValueReason == -1) {
            this.sortValueReason = 1;
        } else {
            this.sortValueReason = -1;
        }
        this.pageSizeReason = this.paginatorReason?.pageSize
            ? this.paginatorReason?.pageSize
            : 100;
        this.pageNumber =
            this.paginatorReason.pageIndex + 1
                ? this.paginatorReason.pageIndex + 1
                : 1;
        let pageparams;
        pageparams = `?pageSize=${this.pageSizeReason}&pageNumber=${this.pageNumber}`;
        if (this.reasonSearch) {
            pageparams += `&searchKey=${this.reasonSearch}`;
        }
        if (this.sortReason) {
            pageparams += `&sort=${this.sortReason}&sortValue=${this.sortValueReason}`;
        }
        this.spinner.show();
        this.adminService.getAllReasons(pageparams).subscribe(
            (res: any) => {
                if (res.data[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSourceReason = res.data[0].data;
                this.pageLengthReason = res.data[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    addReason() {
        if (this.createReasonForm.invalid) {
            this.snackBar.open('Reason is Required', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        if (this.modifyDataReason) {
            let obj = {
                id: this.modifyDataReason._id,
                ...this.createReasonForm.value,
            };
            this.spinner.show();
            this.adminService.updateStoppedReason(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.getAllStoppedReasons();
                    this.createReasonForm.reset();
                    this.modifyDataReason = false;
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
            this.spinner.show();
            this.adminService
                .createStpooedReason(this.createReasonForm.value)
                .subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });

                        this.getAllStoppedReasons();
                        this.createReasonForm.reset();
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
    doFilterReason(value: any) {
        this.reasonSearch = value;
        this.getAllStoppedReasons();
    }
    editReason(data: any) {
        this.modifyReason = true;
        this.modifyDataReason = data;
        this.createReasonForm.patchValue(this.modifyDataReason);
    }
    deleteReason(id: any) {
        this.spinner.show();
        this.adminService.deleteReason(id).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.getAllStoppedReasons();
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
            }
        );
    }
}
