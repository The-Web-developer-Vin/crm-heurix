import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminService } from 'app/core/admin/admin.service';
import { cloneDeep } from 'lodash';
import { AddProjectComponent } from './add-project/add-project.component';
import { DatePipe } from '@angular/common';
import { ViewPaymentsComponent } from './view-payments/view-payments.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
    sortValue = 1;
    budgetForm!: FormGroup;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @ViewChild(MatSort) sort: MatSort;
    secondary = [];
    sort: any = '';
    displayedColumns = [
        'name',
        'client',
        // 'country',
        'startDate',
        'stream',
        'budget',
        // 'monthPaid',
        'paid',
        'due',
        // 'createdBy',
        'status',

        'actions',
    ];
    dataSource = new MatTableDataSource<Element>();
    public pageSize = 100;
    pageLength: any;
    pageNumber = 1;
    projectsData: any;
    dialog: any;
    startYear;
    years: any = [];
    monthName;
    yearNumber;
    currentYearIs: any;
    projectsTotalData: any;
    projectId: any;
    searchValue: any;
    months = [
        { name: 'January ', val: 1 },
        { name: 'February ', val: 2 },
        { name: 'March ', val: 3 },
        { name: 'April ', val: 4 },
        { name: 'May ', val: 5 },
        { name: 'June ', val: 6 },
        { name: 'July ', val: 7 },
        { name: 'August ', val: 8 },
        { name: 'September ', val: 9 },
        { name: 'October ', val: 10 },
        { name: 'November ', val: 11 },
        { name: 'December ', val: 12 },
    ];
    monthnumber: any;
    projectType: any;
    defaultAll: boolean = true;
    @ViewChild('addbudget') addbudget: TemplateRef<any>;
    role: any;
    categoryName = '';
    amount: any;
    clearShow: boolean = false;
    counts: any;
    rowId;
    selectedClientId: any;
    clientDetails: any;
    clientData: any;
    budgetDate: string;
    currencyName: any;
    getallcoutries: any;
    backShow: boolean = false;
    constructor(
        private matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {
        const d = new Date();
        let name = this.months[d.getMonth()];
        //this.monthnumber = d.getMonth() + 1;
        this.monthName = name.name;
    }

    ngOnInit(): void {
        if (this.categoryName == 'dev') {
            this.currencyName = '63f06c32d69132cabaadcf8a';
        } else {
            this.currencyName = '6451fb8828010ebb35c7db79';
        }

        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        if (this.role == 'Admin') {
            this.categoryName = 'dev';
            // if (this.displayedColumns.length) {
            //     this.displayedColumns.pop();
            // }
        }
        this.budgetForm = new FormGroup({
            amount: new FormControl('', Validators.required),
            paymentDate: new FormControl('', Validators.required),
        });
        this.getYears();
        this.getProjects();
        this.getCount();
        this.getCountryDetails();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    matClose() {
        this.matDialog.closeAll();
    }
    getYears() {
        let currentYear = new Date().getFullYear();
        let startYear = 2023;
        while (startYear <= currentYear) {
            this.years.push(startYear++);
        }
        // this.yearNumber = currentYear;
    }

    selectedYear(e: any) {
        console.log('fs', e);
    }
    doFilter(value: any) {
        this.searchValue = value;
        this.clearShow = true;
        this.getProjects();
        this.getCount();
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getProjects();
        this.getCount();
    }

    add() {
        const addSales = this.matDialog.open(AddProjectComponent, {
            width: '50rem',
            height: '600px',
            id: 'dialog1',
        });
        addSales.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getProjects();
                    this.getCount();
                }
            }
        });
    }
    edit(editData) {
        const editprojectdata = this.matDialog.open(AddProjectComponent, {
            width: '50rem',
            height: '530px',
            data: {
                Data: cloneDeep(editData),
            },
        });
        editprojectdata.afterClosed().subscribe((result) => {
            if (result != 'close') {
                if (result) {
                    this.getProjects();
                    this.getCount();
                }
            }
        });
    }
    addBudget(id: any) {
        console.log('fgfg', id);
        this.matDialog.open(this.addbudget, {
            width: '35%',
        });
        if (id.projectId) {
            this.projectId = id.projectId;
        } else {
            this.projectId = id._id;
        }
        this.projectType = id.project_type;
    }
    addDate(e: any) {
        let data = new Date(e.value);
        this.budgetDate = data.toLocaleDateString('fr-CA');
        console.log('djfhdf', this.budgetDate);
    }
    addbudgetToProject() {
        let obj = {
            projectId: this.projectId,
            amount: this.budgetForm.value.amount,
            paymentDate: this.budgetDate,
            projectType: this.projectType,
        };
        this.adminService.addBudget(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.matDialog.closeAll();
                this.getProjects();
                this.getCount();
                this.budgetForm.reset();
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
    delete(data: any) {
        console.log('id', data);
        let deleteId;
        if (data.projectId) {
            deleteId = data.projectId;
        } else {
            deleteId = data._id;
        }

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Project',
            message: 'Are you sure you want to Delete this Project?',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.adminService.deleteProject(deleteId).subscribe(
                    (res: any) => {
                        this.snackBar.open(res.message, 'Close', {
                            duration: 3000,
                        });
                        this.getProjects();
                        this.getCount();
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
        });
    }

    getAllProjects() {
        this.defaultAll = true;
        this.monthnumber = null;
        this.yearNumber = null;
        this.searchValue = null;
        this.getProjects();
        this.getCount();
    }
    getMonthValue(e: any) {
        this.defaultAll = false;
        this.monthnumber = e;
        this.clearShow = true;
        this.getProjects();
        this.getCount();
    }
    getYearValue(e: any) {
        this.defaultAll = false;
        this.yearNumber = e;
        this.clearShow = true;
        this.getProjects();
        this.getCount();
    }
    getCountryDetails() {
        let pageParams;
        if (this.categoryName) {
            pageParams = `?type=${this.categoryName}`;
        }
        this.adminService
            .getTypeBasedCurrency(pageParams)
            .subscribe((res: any) => {
                this.getallcoutries = res.data;
            });
    }
    selectedCurrency(e: any) {
        this.currencyName = e;
        this.getProjects();
        this.getCount();
    }
    getProjects(eve?, searchKey?) {
        this.backShow = false;
        this.rowId = undefined;
        if (this.sortValue == -1) {
            this.sortValue = 1;
        } else {
            this.sortValue = -1;
        }

        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;

        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }`;
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.searchValue) {
            pageparams += `&searchKey=${this.searchValue}`;
        }
        if (this.currencyName) {
            pageparams += `&currency=${this.currencyName}`;
        }
        if (this.monthnumber && this.yearNumber) {
            pageparams += `&month=${this.monthnumber}&year=${this.yearNumber}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getprojects(pageparams).subscribe(
            (res: any) => {
                this.projectsData = res.data.projectDetails;
                this.projectsTotalData = res.data.projectDetails;
                this.amount = res.data;
                if (res.data.projectDetails.length != 0) {
                    this.projectsData?.push({
                        project_budget: res.data.total_budget,
                        totalPaid: res.data.total_paid,
                        due: res.data.total_due,
                        total: true,
                    });
                }
                this.dataSource = res.data.projectDetails;
                this.pageLength = res.data.pagination?.total;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    getTomorrow() {
        let d = new Date();

        d.setDate(d.getDate());
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }
    view(editData) {
        if (editData._id != undefined) {
            const viewPayment = this.matDialog.open(ViewPaymentsComponent, {
                width: '36rem',
                // height: '500px',
                panelClass: 'views',
                data: {
                    Data: cloneDeep(editData),
                    view: true,
                },
            });
            viewPayment.afterClosed().subscribe((result) => {});
        }
    }
    viewBudget(budgetData) {
        if (budgetData._id != undefined) {
            const viewBudget = this.matDialog.open(ViewPaymentsComponent, {
                width: '900px',
                // height: '500px',
                panelClass: 'views',
                data: {
                    Data: cloneDeep(budgetData),
                    view: false,
                },
            });
            viewBudget.afterClosed().subscribe((result) => {});
        }
    }
    getCategory(e: any) {
        this.searchValue = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.categoryName = e;
        this.getProjects();
        this.getCount();
        this.getCountryDetails();
    }
    getDevProjects() {
        this.searchValue = null;
        this.monthnumber = null;
        this.yearNumber = null;

        this.getProjects();
        this.getCount();
        this.getCountryDetails();
    }
    openSingleProject(data: any) {
        let id;
        if (data.projectId) {
            id = data.projectId;
        } else {
            id = data._id;
        }
        this.router.navigate([]).then((result) => {
            window.open(`/projects/single?id=${id} `, '_blank');
        });
    }
    openSingleClient(id: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/clients/single?id=${id} `, '_blank');
        });
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    clear() {
        this.searchValue = null;
        this.monthnumber = null;
        this.yearNumber = null;
        this.clearShow = false;

        if (this.role == 'Admin') {
            this.categoryName = 'dev';
        }
        this.getProjects();
        this.getCount();
    }
    getCount() {
        this.rowId = undefined;
        this.paginator.pageSize = this.paginator?.pageSize
            ? this.paginator.pageSize
            : 100;

        let pageparams;
        pageparams = `?pageSize=${this.paginator.pageSize}&pageNumber=${
            this.paginator.pageIndex + 1
        }`;
        if (this.categoryName) {
            pageparams += `&type=${this.categoryName}`;
        }
        if (this.searchValue) {
            pageparams += `&searchKey=${this.searchValue}`;
        }
        if (this.monthnumber && this.yearNumber) {
            pageparams += `&month=${this.monthnumber}&year=${this.yearNumber}`;
        }
        if (this.currencyName) {
            pageparams += `&currency=${this.currencyName}`;
        }
        this.adminService
            .getProjectsCounts(pageparams)
            .subscribe((res: any) => {
                this.counts = res.data;
            });
    }
    toggleDetails(id: any, data: any, i: any) {
        this.backShow = true;
        this.dataSource = data.project;
    }
    back() {
        this.backShow = false;
        this.getAllProjects();
    }
}
