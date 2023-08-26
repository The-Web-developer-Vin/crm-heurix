/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormControl,
    FormArray,
    FormGroup,
    Validators,
    FormBuilder,
} from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AdminService } from 'app/core/admin/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { forEach, round } from 'lodash';
export interface PeriodicElement {
    paid_date: number;
    amount_paid: number;
}
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
    selector: 'app-add-payment',
    templateUrl: './add-payment.component.html',
    styleUrls: ['./add-payment.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AddPaymentComponent implements OnInit {
    displayedColumns: string[] = [
        'paid_date',
        'received_date',
        'amount_paid',
        'inr',
    ];
    dataSource = new MatTableDataSource<Element>();
    dataSourceAddPayment: any = new MatTableDataSource<any>();
    dataSourceAddPayment2: any = new MatTableDataSource<any>();
    displayedColumnsPayment: string[] = [
        'pName',
        'budget',
        'due',
        'amount',
        // 'inr',
    ];
    displayedColumnsPayment2: string[] = [
        'pName',
        'budget',
        'due',
        'amount',
        //'inr',
    ];
    createForm!: FormGroup;
    oldData: any;
    modify: boolean = false;
    disable: boolean = false;
    submitted = false;
    modifyData: any = this.data;
    updatedData: any = this.data;
    checkedList: any = this.data;
    editdata: boolean = false;
    viewData: any = this.data;
    hide: boolean = false;
    view: boolean = false;
    milestonesData: any = [];
    projectId: any;
    milestones: any;
    showDueAmount: boolean = true;
    getallpaids: any;
    paymentDate: any;
    receivedDate: any;
    paidThroughValue: any;

    editPaymentModify = this.data;
    editArray = [];
    count: any;
    first_table_data = [];
    array1 = [];
    array2 = [];

    items: FormArray;
    paidAmount: any;
    currencyName: any;
    constructor(
        private matDialog: MatDialogRef<AddPaymentComponent>,
        private snackBar: MatSnackBar,
        private datePipe: DatePipe,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {
        this.createForm = new FormGroup({
            items: new FormArray([]),
            paymentDate: new FormControl('', Validators.required),
            paidThrough: new FormControl('', Validators.required),
            receivedDate: new FormControl(''),
        });
    }

    createItem(due, index?): FormGroup {
        return this.formBuilder.group({
            totalPaid: new FormControl(due, Validators.required),

            inrAmount: new FormControl('', Validators.required),
            hoursTrack: new FormControl(''),
        });
    }
    ngOnInit(): void {
        this.getPaidthrough();
        console.log('data', this.checkedList.Data[0]);
        this.currencyName = this.checkedList.Data[0].currency;
        if (this.checkedList?.Data[0].length > 10) {
            let a = round(this.checkedList?.Data[0].length / 2);
            this.checkedList?.Data[0].forEach((ele, index) => {
                // console.log('ele', ele);
                if (index <= a - 1) {
                    this.array1.push(ele);
                } else {
                    this.array2.push(ele);
                }
            });
            console.log(this.array1.length, 'sdjlh jhs', this.array2);
            this.array1.forEach((ele, index) => {
                this.items = this.createForm.get('items') as FormArray;
                this.items.push(this.createItem(ele.due));
            });
            this.array2.forEach((ele, index) => {
                this.items = this.createForm.get('items') as FormArray;
                console.log('this.createForm.get(items)', ele.due);
                this.items.push(this.createItem(ele.due, index));
            });

            this.dataSourceAddPayment = this.array1;

            this.dataSourceAddPayment2 = this.array2;
        } else {
            this.dataSourceAddPayment = this.checkedList?.Data[0];
            this.checkedList?.Data[0].forEach((ele, index) => {
                this.items = this.createForm.get('items') as FormArray;
                this.items.push(this.createItem(ele.due));
            });
        }

        // if ((this.viewData.type = 'paid')) {
        //     this.showDueAmount = false;
        // }
        this.checkedList?.Data[0].forEach((ele) => {
            if (ele.project_type == 'Hourly') {
                this.displayedColumnsPayment = [
                    'pName',
                    'hourlyRate',
                    'hrsTracked',
                    //'due',
                    'amount',
                    // 'inr',
                ];
            } else {
                this.displayedColumnsPayment = [
                    'pName',
                    'budget',
                    'due',
                    'amount',
                    //'inr',
                ];
                this.displayedColumnsPayment2 = [
                    'pName',
                    'budget',
                    'due',
                    'amount',
                    // 'inr',
                ];
            }
        });
        // if (this.checkedList?.Data[0][0]?.project_type == 'Hourly') {
        //     this.displayedColumnsPayment = [
        //         'pName',
        //         'hourlyRate',
        //         'hrsTracked',
        //         //'due',
        //         'amount',
        //         'inr',
        //     ];
        // }
        if (this.modifyData) {
            this.modify = true;
        }
        if (this.updatedData.modify == true) {
            this.editdata = true;
            this.createForm.patchValue({
                amount_paid: this.updatedData.Data.paid,
                paymentDate: this.updatedData.Data.updated_at,
            });
        }
        if (this.viewData.view == true) {
            this.view = true;
            this.projectId = this.viewData.Data.projectId;
            this.paymentTransactions();
        }
    }
    paymentTransactions() {
        this.spinner.show();
        this.adminService.paymentbyIDMilestones(this.projectId).subscribe(
            (res: any) => {
                this.milestones = res;
                this.dataSource = res.data;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    close() {
        this.matDialog.close('close');
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    amountPaid(e: any, i: any, table?: any) {
        if (table) {
            this.checkedList.Data[0][i + this.array2.length].totalPaid =
                e.target?.value;
            this.paidAmount =
                this.checkedList.Data[0][i + this.array2.length].totalPaid;
        } else {
            this.checkedList.Data[0][i].totalPaid = e.target?.value;
            this.paidAmount = this.checkedList.Data[0][i].totalPaid;
        }
    }
    amountINR(e: any, i: any, table?: any) {
        if (table) {
            this.checkedList.Data[0][i + this.array2.length].inrAmount =
                e.target?.value;
        } else {
            this.checkedList.Data[0][i].inrAmount = e.target.value;
        }
    }
    hoursTracked(e: any, i: any, table?: any) {
        if (table) {
            this.checkedList.Data[0][i + this.array2.length].hoursTrack =
                e.target?.value;
        } else {
            this.checkedList.Data[0][i].hoursTrack = e.target.value;
        }
    }
    addDate(type: any, event: MatDatepickerInputEvent<Date>) {
        let data = new Date(event.value);
        if (type == 'payment') {
            this.paymentDate = data.toLocaleDateString('fr-CA');
        } else if (type == 'receive') {
            this.receivedDate = data.toLocaleDateString('fr-CA');
        }
    }

    getPaymentMethod(e: any, i: any) {
        this.paidThroughValue = e.value;
    }
    getPaidthrough() {
        this.adminService.getPaidThrough('').subscribe((res: any) => {
            this.getallpaids = res.data[0].data;
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

        for (let i = 0; i < this.checkedList.Data[0].length; i++) {
            //console.log('checkedList', i, this.checkedList.Data[0][i]);
            let obj = {
                projectId: this.checkedList.Data[0][i].projectId,
                totalPaid: this.paidAmount
                    ? this.paidAmount
                    : this.checkedList.Data[0][i]?.due,
                clientId: this.checkedList.Data[0][i].client,
                paymentDate: this.paymentDate,
                inrAmount: this.checkedList.Data[0][i].inrAmount,
                hoursTrack: this.checkedList.Data[0][i].hoursTrack,
                receivedDate: this.receivedDate,
                paidThrough: this.paidThroughValue,
            };
            console.log('obj', obj);
            this.spinner.show();
            this.adminService.addPayments(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.spinner.hide();
                    this.matDialog.close('submit');
                },
                (err: any) => {
                    this.snackBar.open(err.error.message, 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                    console.log('err', err);
                    this.matDialog.close('close');
                    this.spinner.hide();
                }
            );
        }
    }

    getTomorrow() {
        let d = new Date();
        d.setDate(d.getDate());
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }
}
