/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';
import { map, Observable, startWith } from 'rxjs';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AddProjectComponent implements OnInit {
    hourlybudget: boolean = false;
    projectsBudget: boolean = false;
    createForm!: FormGroup;
    oldData: any;
    modify: boolean = false;
    disable: boolean = false;
    modifyData: any = this.data;
    submitted = false;
    streams: any = [];
    budget: boolean = false;
    streamOptions: boolean = false;
    timeLines: any = [];
    // options: any[] = ['Suresh', 'Naresh', 'Ramesh'];
    filteredOptions: Observable<any[]>;
    clientslist: any;
    categoryValues: any;
    employeeslists: any;
    employeeslist: any = [];
    streamFrnt: any = [];
    streambackend: any = [];
    streamCms: any = [];
    clientId;
    employee_id: any;
    getTechnologylist: any = [];
    employeeName: any;
    getallcoutries;
    seloptions: boolean = false;
    employeeIds: any;
    employeeIdss: any;
    projectBudget: boolean = false;
    hourly: boolean = false;
    role: any;

    // digital marketing
    createDigitalForm!: FormGroup;
    projectDetails: FormArray;
    detailsForm;
    digitalEmployee: any;
    employeeData: any;
    technologyArray: any;
    projectStatus;
    showStatus: boolean = false;
    completedStatus: boolean = false;
    reasons: any;
    selectedPaymentDate: any;
    selectedStartDate: any;
    selectedEndDate: any;
    selectedStoppedDate: any;
    selectedCompletedDate: any;
    constructor(
        private matDialogref: MatDialogRef<AddProjectComponent>,

        private matDialog: MatDialog,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private fs: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        this.getClients();
        //this.getEmployees();
        this.getCountryDetails();
        if (this.role == 'Digital marketing Manager') {
            this.getDigitalEmployeesList();
        }
        this.getAllStoppedReasons();
        this.getTechnologyList();
    }

    ngOnInit(): void {
        this.createForm = this.fs.group({
            client: ['', Validators.required],
            name: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: [''],
            paymentDate: ['', Validators.required],
            project_type: ['', Validators.required],
            technology: ['', Validators.required],
            project_budget: ['', Validators.required],
            hours: [''],
            country: [''],
            employees: ['', Validators.required],
            status: [''],
            project_url: [''],
            department: ['', Validators.required],
            stopped_date: [''],
            completed_date: [''],
            stoppedReason: [
                '',
                this.modifyData?.Data?.status == 'Stopped'
                    ? Validators.required
                    : '',
            ],
        });

        this.createDigitalForm = this.fs.group({
            client: ['', Validators.required],
            country: [''],
            paymentDate: ['', Validators.required],
        });
        this.detailsForm = new FormGroup({
            projectDetails: new FormArray([]),
        });
        this.addProject();

        if (this.modifyData) {
            this.modify = true;
            this.employeeslist = this.modifyData.Data.employees;
            this.createForm.patchValue(this.modifyData.Data);

            this.modify = true;

            this.employeeIdss = this.modifyData.Data.employees.map(
                (employee) => employee.name
            );

            this.selectedStartDate = this.modifyData.Data.start_date;
            this.selectedPaymentDate = this.modifyData.Data.paymentDate;
            this.selectedEndDate = this.modifyData.Data.end_date;
            this.createForm.patchValue({
                technology: this.modifyData.Data.technology._id,
                country: this.modifyData.Data.country._id,
                client: this.modifyData.Data.client._id,
                project_budget: this.modifyData.Data.latestBudget,
                employees: this.employeeIdss,
                hours: this.modifyData.Data.hours,
            });
            if (
                this.modifyData.Data.project_type == 'Monthly' ||
                this.modifyData.Data.project_type == 'Fixed'
            ) {
                this.projectBudget = true;
                this.hourly = false;
            } else if (this.modifyData.Data.project_type == 'Hourly') {
                this.hourly = true;
                this.projectBudget = false;
            }
            if (this.role == 'Digital marketing Manager') {
                this.createForm.patchValue({
                    employees: this.modifyData.Data.employees[0]._id,
                });
            }
            if (this.modifyData.Data.status == 'Stopped') {
                this.showStatus = true;
                this.createForm.patchValue({
                    stopped_date: moment(
                        this.modifyData.Data.stopped_date
                    ).utc(),
                });
                this.createForm.patchValue({
                    stoppedReason: this.modifyData.Data.stoppedReason?._id,
                });
                this.selectedStoppedDate = this.modifyData.Data.stopped_date;
            }
            if (this.modifyData.Data.status == 'Completed') {
                this.completedStatus = true;
                this.createForm.patchValue({
                    completed_date: moment(
                        this.modifyData.Data.completed_date
                    ).utc(),
                });
                this.selectedCompletedDate =
                    this.modifyData.Data.completed_date;
            }
            this.timeLines = this.modifyData.Data.time_line;
        }
    }
    close() {
        this.matDialogref.close('close');
        localStorage.removeItem('employeeslist');
    }
    getCountryDetails() {
        this.adminService.getCountries('').subscribe((res: any) => {
            this.getallcoutries = res.data[0].data;
        });
    }

    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    selectedCategories(e: any) {
        this.categoryValues = e;
    }
    getClients() {
        this.adminService.getallclients('').subscribe((res: any) => {
            this.clientslist = res.data;
        });
    }

    selectTechnology(e: any) {
        this.technologyArray = e.value;
    }
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        let data = new Date(event.value);

        if (type == 'payment') {
            this.selectedPaymentDate = data.toLocaleDateString('fr-CA');
        } else if (type == 'start') {
            this.selectedStartDate = data.toLocaleDateString('fr-CA');
        } else if (type == 'deadLine') {
            this.selectedEndDate = data.toLocaleDateString('fr-CA');
        } else if (type == 'stopped') {
            this.selectedStoppedDate = data.toLocaleDateString('fr-CA');
        } else if (type == 'completed') {
            this.selectedCompletedDate = data.toLocaleDateString('fr-CA');
        }
    }
    save() {
        this.submitted = true;
        let empIdsArray = [];
        let empIds;
        let formIds;
        if (this.role != 'Digital marketing Manager') {
            this.employeeslist.forEach((element) => {
                this.createForm.value.employees.forEach((ele) => {
                    if (element.name == ele) {
                        empIdsArray.push(element._id);
                    }
                });
            });
            this.employeeData = empIdsArray
                ? empIdsArray
                : this.createForm.value.employees;
        } else {
            empIdsArray = this.modifyData.Data.employees;
            this.employeeData = this.createForm.value.employees
                ? this.createForm.value.employees
                : empIdsArray;
        }

        if (this.createForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        if (this.modifyData) {
            if (
                this.createForm.value.status == 'Stopped' &&
                !this.createForm.value.stoppedReason
            ) {
                this.snackBar.open('Stopped Reason is Required', 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                return;
            }
            let obj: any = {
                id: this.modifyData.Data.projectId
                    ? this.modifyData.Data.projectId
                    : this.modifyData.Data._id,
                department: this.modifyData.Data.department,
                client: this.createForm.value.client,
                name: this.createForm.value.name,
                start_date: this.selectedStartDate,
                paymentDate: this.selectedPaymentDate,
                end_date: this.selectedEndDate,
                technology: this.createForm.value.technology,
                project_type: this.createForm.value.project_type,
                project_budget: this.createForm.value.project_budget,
                country: this.createForm.value.country,
                hours: this.createForm.value.hours,
                employees: this.employeeData,
                status: this.createForm.value.status,
                project_url: this.createForm.value.project_url,
                stopped_date: this.selectedStoppedDate,
                completed_date: this.selectedCompletedDate,
            };
            if (this.createForm.value.stoppedReason) {
                obj.stoppedReason = this.createForm.value.stoppedReason;
            }

            this.adminService.updateProjects(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.createForm.value.name = '';
                    this.createForm.reset();
                    localStorage.removeItem('employeeslist');
                    this.matDialogref.close('submit');
                },
                (err: any) => {
                    this.snackBar.open(err.error.message, 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                    console.log(err);
                }
            );
        } else {
            let obj = {
                client: this.createForm.value.client,
                name: this.createForm.value.name,
                start_date: this.selectedStartDate,
                end_date: this.selectedEndDate,
                paymentDate: this.selectedPaymentDate,
                technology: this.createForm.value.technology,
                project_type: this.createForm.value.project_type,
                project_budget: this.createForm.value.project_budget,
                country: this.createForm.value.country,
                hours: this.createForm.value.hours,
                employees: empIdsArray,
                project_url: this.createForm.value.project_url,
                department: this.createForm.value.department,
            };

            this.adminService.addProjects(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });

                    localStorage.removeItem('employeeslist');
                    this.matDialogref.close('submit');
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

    showOptions(e: any) {
        if (e.checked === true) {
            this.streamOptions = true;
        } else {
            this.streamOptions = false;
        }
        this.streams.push(e.source.value);
    }
    selectedTimeline(e: any) {
        this.timeLines = e;
        if (this.timeLines == 'Monthly' || this.timeLines == 'Fixed') {
            this.projectBudget = true;
            this.hourly = false;
        } else if (this.timeLines == 'Hourly') {
            this.hourly = true;
            this.projectBudget = false;
        }
    }

    check(val) {
        let check = this.streams.find((data: any) => data == val);
        return check ? true : false;
    }
    getTechnologyList() {
        let pageParams;
        if (this.role == 'Digital marketing Manager') {
            pageParams = `?department=digital`;
        } else {
            pageParams = `?department=dev`;
        }

        this.adminService.getStream(pageParams).subscribe((res: any) => {
            this.getTechnologylist = res.data[0].data;
        });
    }
    openEmployeeList() {
        const employeeList = this.matDialog.open(EmployeeListComponent, {
            data: this.modifyData?.Data?.employees,
            width: '35rem',
            id: 'dialog2',
            // height: '620px',
        });
        employeeList.afterClosed().subscribe((result) => {
            this.employeeslist = JSON.parse(
                localStorage.getItem('employeeslist')
            );

            this.employeeIds = this.employeeslist.map(
                (employee) => employee.name
            );

            this.createForm.patchValue({
                employees: this.employeeIds,
            });
        });
    }
    createItem(): FormGroup {
        return this.fs.group({
            name: ['', [Validators.required]],
            technology: ['', [Validators.required]],
            project_url: [''],
            project_type: ['', [Validators.required]],
            project_budget: ['', [Validators.required]],
            hours: [''],
            start_date: ['', [Validators.required]],
            employees: ['', [Validators.required]],
        });
    }
    addProject() {
        this.projectDetails = this.detailsForm.get(
            'projectDetails'
        ) as FormArray;
        this.projectDetails.push(this.createItem());
    }
    removeProject(i) {
        if (this.projectDetails.length != 1) {
            const remove = this.detailsForm.get('projectDetails') as FormArray;
            remove.removeAt(i);
        }
    }
    getDigitalEmployeesList() {
        this.adminService
            .getDigitalMarketingEmployees()
            .subscribe((res: any) => {
                this.digitalEmployee = res.data.employee;
            });
    }
    selectedStatus(e: any) {
        this.projectStatus = e;
        if (this.projectStatus == 'Stopped') {
            this.showStatus = true;
        } else {
            this.showStatus = false;
        }
        if (this.projectStatus == 'Completed') {
            this.completedStatus = true;
        } else {
            this.completedStatus = false;
        }
    }
    saveDigital() {
        if (this.createDigitalForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        for (let i = 0; i <= this.projectDetails.length; i++) {
            let obj = {
                ...this.createDigitalForm.value,
                paymentDate: this.selectedPaymentDate,
                name: this.projectDetails.value[i].name,
                technology: this.projectDetails.value[i].technology,
                project_url: this.projectDetails.value[i].project_url,
                project_type: this.projectDetails.value[i].project_type,
                project_budget: this.projectDetails.value[i].project_budget,
                hours: this.projectDetails.value[i].hours,
                start_date:
                    this.projectDetails.value[
                        i
                    ].start_date._d.toLocaleDateString('fr-CA'),
                employees: this.projectDetails.value[i].employees,
                department: 'digital',
            };

            this.adminService.addProjects(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });

                    this.matDialogref.close('submit');
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
    getAllStoppedReasons() {
        this.adminService.getAllReasons('').subscribe(
            (res: any) => {
                this.reasons = res.data[0].data;
            },
            (err: any) => {}
        );
    }
}
