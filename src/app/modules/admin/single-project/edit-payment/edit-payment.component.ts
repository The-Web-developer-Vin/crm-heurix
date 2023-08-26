import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
    selector: 'app-edit-payment',
    templateUrl: './edit-payment.component.html',
    styleUrls: ['./edit-payment.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class EditPaymentComponent implements OnInit {
    createForm: FormGroup;
    getallpaids: any;
    paymentDate: any;
    receivedDate: any;
    paidThroughValue: any;
    checkedList;
    displayedColumnsPayment: string[] = ['budget', 'due', 'amount', 'inr'];
    dataSourceAddPayment = new MatTableDataSource<any>();
    array: any = [];
    selectedReceivedDate: any;
    selectedPaymentDate: any;
    constructor(
        private matDialog: MatDialog,
        private dailogRef: MatDialogRef<EditPaymentComponent>,
        private snackBar: MatSnackBar,
        private datePipe: DatePipe,
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private importedData: { paymentData: any; projectData }
    ) {}

    ngOnInit(): void {
        this.getPaidthrough();
        this.createForm = new FormGroup({
            amountPaid: new FormControl('', Validators.required),
            paidDate: new FormControl('', Validators.required),
            paidThrough: new FormControl('', Validators.required),
            receivedDate: new FormControl(''),
            inrAmount: new FormControl('', Validators.required),
            hoursTrack: new FormControl(''),
        });

        this.checkedList = this.importedData;

        this.array.push(this.importedData.paymentData);
        this.dataSourceAddPayment = this.array;
        console.log('data', this.importedData);
        if (this.checkedList) {
            this.selectedPaymentDate = this.importedData.paymentData.paidDate;
            this.selectedReceivedDate =
                this.importedData.paymentData.receivedDate;
            this.createForm.patchValue({
                amountPaid: this.importedData.paymentData.paid,
                paidDate: this.selectedPaymentDate,
                paidThrough: this.importedData.paymentData.paidThroughId,
                receivedDate: this.selectedReceivedDate,
                inrAmount: this.importedData.paymentData.inrAmount,
                hoursTrack: this.importedData.paymentData.hoursTrack,
            });
        }
        if (this.importedData?.projectData?.project_type == 'Hourly') {
            this.displayedColumnsPayment = [
                'hourlyRate',
                'hrsTracked',
                //'due',
                'amount',
                'inr',
            ];
        }
    }
    getPaidthrough() {
        this.adminService.getPaidThrough('').subscribe((res: any) => {
            this.getallpaids = res.data[0].data;
        });
    }
    close() {
        this.dailogRef.close('close');
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    getTomorrow() {
        let d = new Date();

        d.setDate(d.getDate());
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }
    amountPaid(e: any, i: any) {
        console.log('e', e.target.value);
    }
    amountINR(e: any, i: any) {
        this.checkedList.Data[i].inrAmount = e.target.value;
    }
    hoursTracked(e: any, i: any) {
        this.checkedList.Data[i].hoursTrack = e.target.value;
    }

    addReceivedDate(e: any) {
        this.receivedDate = e.target.value;
    }
    getPaymentMethod(e: any) {
        console.log('e', e);
        this.paidThroughValue = e.value;
    }
    addDate(type: any, event: MatDatepickerInputEvent<Date>) {
        let data = new Date(event.value);
        if (type == 'payment') {
            this.selectedPaymentDate = data.toLocaleDateString('fr-CA');
        } else if (type == 'receive') {
            this.selectedReceivedDate = data.toLocaleDateString('fr-CA');
        }
    }
    save() {
        let obj = {
            receivedDate: this.selectedReceivedDate,
            paidDate: this.selectedPaymentDate,
            mileStoneId: this.importedData.paymentData.mileStoneID,
            projectId: this.importedData.projectData._id,
            amountPaid: this.createForm.value.amountPaid,
            paidThrough: this.createForm.value.paidThrough,
            inrAmount: this.createForm.value.inrAmount,
            hoursTrack: this.createForm.value.hoursTrack,
        };
        console.log('dfgkfj', obj);
        this.spinner.show();
        this.adminService.editPaymentProject(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.spinner.hide();
                this.dailogRef.close('submit');
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
}
