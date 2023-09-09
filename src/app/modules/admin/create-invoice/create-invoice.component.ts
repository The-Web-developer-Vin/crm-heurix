import { Component, OnInit } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-create-invoice',
    templateUrl: './create-invoice.component.html',
    styleUrls: ['./create-invoice.component.scss'],
})
export class CreateInvoiceComponent implements OnInit {
    invoiceForm: FormGroup;
    items: FormArray;
    totalWithoutTax: any = 0;
    grandTotal: any = 0;
    taxAmount: any = 0;
    state: any = [];
    showGst: boolean = false;
    showStateTax: boolean = false;
    selectedState: any;
    bankDetails: any;
    clients: any = [];
    coutries: any = [];
    accountDetails: any;
    modify: boolean = false;
    invoiceId: any;
    selectedCountry: any;
    showState: boolean = false;
    constructor(
        private fs: FormBuilder,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private router: Router,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute
    ) {
        this.invoiceForm = new FormGroup({
            companyName: new FormControl('', Validators.required),
            clientGST: new FormControl(''),
            billingAddress: new FormControl(''),
            state: new FormControl(''),
            country: new FormControl('', Validators.required),
            clientName: new FormControl('', Validators.required),
            clientNumber: new FormControl('', Validators.required),
            clientMail: new FormControl('', [
                Validators.required,
                Validators.email,
            ]),
            // bankDetails: new FormControl('', Validators.required),
            items: new FormArray([]),
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.invoiceId = res.id;
                this.getById();
            } else {
                this.addItem('', '', '', '');
            }
        });

        this.getCities();
        this.getAllClient();
        this.getCountryDetails();
    }
    getById() {
        this.modify = true;
        this.spinner.show();
        this.adminService.getByInvoiceId(this.invoiceId).subscribe(
            (res: any) => {
                this.invoiceForm.patchValue(res.data.invoice);
                this.totalWithoutTax = res.data.invoice.totalWithOutTax;
                this.taxAmount = res.data.invoice.tax;
                this.grandTotal = res.data.invoice.grandTotal;
                this.bankDetails = res.data.invoice.bankDetails;
                this.invoiceForm.patchValue({
                    clientName: res.data.invoice.clientName._id,
                });
                this.selectedCountry = res.data.invoice.country;
                this.selectedState = res.data.invoice.state;
                if (this.selectedState == 'Andhra Pradesh') {
                    this.showStateTax = true;
                    this.showGst = false;
                } else {
                    this.showStateTax = false;
                    this.showGst = true;
                }
                this.accountDetails = res.data.invoice.accountDetails;
                res.data.invoice.items.forEach((element) => {
                    this.addItem(
                        element.itemDescription,
                        element.totalCost,
                        element.unitPrice,
                        element.units
                    );
                });

                if (!res.data.invoice.items.length) {
                    this.addItem('');
                }
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    getCities() {
        this.adminService.getCityList().subscribe((res: any) => {
            this.state = res.data.list;
        });
    }
    getAllClient() {
        this.adminService.getallclients('').subscribe((res: any) => {
            this.clients = res.data;
        });
    }
    getCountryDetails() {
        this.adminService.getCountries('').subscribe(
            (res: any) => {
                this.coutries = res.data[0].data;
            },
            (err: any) => {
                console.log('err', err);
            }
        );
    }
    selectState(e: any) {
        this.selectedState = e;
        if (e == 'Andhra Pradesh') {
            this.showStateTax = true;
            this.showGst = false;
        } else {
            this.showStateTax = false;
            this.showGst = true;
        }
        if (e) {
            this.taxAmount = Math.round((this.totalWithoutTax * 18) / 100);
        }
        this.grandTotal = this.totalWithoutTax + this.taxAmount;
    }
    selectCountry(e: any) {
        this.selectedCountry = e;
        if (e == 'INR') {
            this.showState = true;
        } else {
            this.showState = false;
            this.showStateTax = false;
            this.showGst = false;
        }
    }
    total(event, index) {
        let res =
            this.items.at(index).get('units').value *
            this.items.at(index).get('unitPrice').value;
        this.items.at(index).get('totalCost').setValue(res);
        this.items.valueChanges.subscribe((data) => {
            this.totalWithoutTax = data.reduce((a, b) => a + +b.totalCost, 0);
        });

        if (this.selectedState) {
            this.taxAmount = Math.round((this.totalWithoutTax * 18) / 100);
        }
        this.grandTotal = this.totalWithoutTax + +this.taxAmount;
    }
    createItem(a?, b?, c?, d?): FormGroup {
        return this.fs.group({
            // item: ['', Validators.required],
            itemDescription: [a, Validators.required],
            totalCost: [b],
            unitPrice: [c, Validators.required],
            units: [d, Validators.required],
        });
    }
    addItem(a?, b?, c?, d?): void {
        this.items = this.invoiceForm.get('items') as FormArray;
        this.items.push(this.createItem(a, b, c, d));
    }
    removeItem(index: any) {
        if (this.items.length > 1) {
            this.items.removeAt(index);
        }
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    checkBank(e: any) {
        this.bankDetails = e.value;
        if (this.bankDetails == 'RK') {
            this.accountDetails = {
                name: 'Radha Krishna Palivela',
                bank: 'HDFC Bank',
                accountNumber: '50100025971832',
                ifsc: 'HDFC0002388',
                address:
                    'Nagamallithota Branch, Kakinada, Andhra Pradesh, India',
            };
        }
        if (this.bankDetails == 'laxmi') {
            this.accountDetails = {
                name: 'Palivela Bala Venkata Naga Lakshmi',
                bank: 'HDFC Bank',
                accountNumber: '50100224091604',
                ifsc: 'HDFC0002388',
                address:
                    'Nagamallithota Branch, Kakinada, Andhra Pradesh, India',
            };
        }
        if (this.bankDetails == 'Company') {
            this.accountDetails = {
                name: 'Vinutnaa IT Services India Pvt. Ltd.',
                bank: 'HDFC Bank',
                accountNumber: '50200007832605',
                ifsc: 'HDFC0002388',
                address:
                    'Nagamallithota Branch, Kakinada, Andhra Pradesh, India',
            };
        }
    }
    save() {
        if (this.invoiceForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        let obj;
        if (this.modify) {
            obj = {
                invoice_Id: this.invoiceId,
                ...this.invoiceForm.value,
                totalWithOutTax: this.totalWithoutTax,
                tax: this.taxAmount,
                grandTotal: this.grandTotal,
                // accountDetails: this.accountDetails,
                // bankDetails: this.bankDetails,
            };
        } else {
            obj = {
                ...this.invoiceForm.value,
                totalWithOutTax: this.totalWithoutTax,
                tax: this.taxAmount,
                grandTotal: this.grandTotal,
                // accountDetails: this.accountDetails,
                // bankDetails: this.bankDetails,
            };
        }

        console.log('obj', obj);
        this.adminService.createInvoice(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.invoiceForm.reset();
                this.router.navigateByUrl('/invoices');
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
