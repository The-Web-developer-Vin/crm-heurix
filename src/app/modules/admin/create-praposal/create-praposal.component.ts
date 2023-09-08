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
    selector: 'app-create-praposal',
    templateUrl: './create-praposal.component.html',
    styleUrls: ['./create-praposal.component.scss'],
})
export class CreatePraposalComponent implements OnInit {
    modify: boolean = false;
    praposalForm: FormGroup;
    coutries: any = [];
    selectedCountry: any;
    showState: boolean = false;
    showGst: boolean = false;
    showStateTax: boolean = false;
    state: any = [];
    selectedState: any;
    scopeForm: FormGroup;
    deliverablesForm: FormGroup;
    deliverablesDetails: FormArray;
    responsbilityForm: FormGroup;
    rolesDetails: FormArray;
    items: FormArray;
    totalWithoutTax: any = 0;
    grandTotal: any = 0;
    taxAmount: any = 0;
    bankDetails: any;
    accountDetails: any;
    proposalId: any;
    constructor(
        private fs: FormBuilder,
        private adminService: AdminService,
        private snackBar: MatSnackBar,
        private router: Router,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute
    ) {
        this.praposalForm = new FormGroup({
            category: new FormControl('', Validators.required),
            clientName: new FormControl('', Validators.required),
            companyName: new FormControl('', Validators.required),
            clientMail: new FormControl('', [
                Validators.required,
                Validators.email,
            ]),
            country: new FormControl('', Validators.required),
            state: new FormControl(''),
            address: new FormControl('', Validators.required),
            executiveSummary: new FormControl('', Validators.required),
            items: new FormArray([]),
        });
        this.scopeForm = this.fs.group({
            scopeDetails: this.fs.array([]),
        });
        this.deliverablesForm = this.fs.group({
            deliverablesDetails: this.fs.array([]),
        });
        this.responsbilityForm = this.fs.group({
            rolesDetails: this.fs.array([]),
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.proposalId = res.id;
                this.getById();
            } else {
                this.addServices('');
                this.addSubService(0, '', '');
                this.addDeliverables('');
                this.addResponsibilty('', '');
                this.addItem('');
            }
        });

        this.getCities();
        this.getCountryDetails();
    }
    getById() {
        this.modify = true;
        this.spinner.show();
        this.adminService.getByProposalId(this.proposalId).subscribe(
            (res: any) => {
                this.praposalForm.patchValue(res.data.proposal);
                this.totalWithoutTax = res.data.proposal.totalWithOutTax;
                this.taxAmount = res.data.proposal.tax;
                this.grandTotal = res.data.proposal.grandTotal;
                this.bankDetails = res.data.proposal.bankDetails;
                this.selectedCountry = res.data.proposal.country;
                this.selectedState = res.data.proposal.state;
                if (this.selectedState == 'Andhra Pradesh') {
                    this.showStateTax = true;
                    this.showGst = false;
                } else {
                    this.showStateTax = false;
                    this.showGst = true;
                }
                this.accountDetails = res.data.proposal.accountDetails;
                res.data.proposal.items.forEach((element) => {
                    this.addItem(
                        element.itemDescription,
                        element.totalCost,
                        element.unitPrice,
                        element.units
                    );
                });

                if (!res.data.proposal.items.length) {
                    this.addItem('');
                }
                res.data.proposal.deliverablesDetails.forEach((element) => {
                    this.addDeliverables(element.deliverables);
                });

                if (!res.data.proposal.deliverablesDetails.length) {
                    this.addDeliverables('');
                }
                res.data.proposal.rolesDetails.forEach((element) => {
                    this.addResponsibilty(element.role, element.responsibility);
                });

                if (!res.data.proposal.rolesDetails.length) {
                    this.addResponsibilty('');
                }
                res.data.proposal.scopeDetails.forEach((element, index) => {
                    this.addServices(element.module);
                    element.subModule.forEach((ele) => {
                        this.addSubService(
                            index,
                            ele.subHeading,
                            ele.subDescription
                        );
                    });
                });
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
    selectCountry(e: any) {
        this.selectedCountry = e;
        if (e == 'INR') {
            this.showState = true;
        } else {
            this.taxAmount = 0;
            this.showState = false;
            this.showStateTax = false;
            this.showGst = false;
        }

        this.grandTotal = this.totalWithoutTax + this.taxAmount;
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
    scopeDetails(): FormArray {
        return this.scopeForm.get('scopeDetails') as FormArray;
    }

    newEmployee(module?): FormGroup {
        return this.fs.group({
            module: module,
            subModule: this.fs.array([]),
        });
    }

    addServices(service?) {
        this.scopeDetails().push(this.newEmployee(service));
    }

    removeService(empIndex: number) {
        if (this.scopeForm.value.scopeDetails.length != 1) {
            this.scopeDetails().removeAt(empIndex);
        }
    }

    employeeSkills(empIndex: number): FormArray {
        return this.scopeDetails().at(empIndex).get('subModule') as FormArray;
    }

    newSkill(subHeading?: any, subDes?: any): FormGroup {
        return this.fs.group({
            subHeading: subHeading,
            subDescription: subDes,
        });
    }

    addSubService(empIndex: number, subHeading?: any, subDes?: any) {
        this.employeeSkills(empIndex).push(this.newSkill(subHeading, subDes));
    }

    removeSubService(empIndex: number, skillIndex: number) {
        if (this.scopeForm.value.scopeDetails[empIndex].subModule.length != 1) {
            this.employeeSkills(empIndex).removeAt(skillIndex);
        }
    }
    createItem(val?): FormGroup {
        return this.fs.group({
            deliverables: [val],
        });
    }
    addDeliverables(val?) {
        this.deliverablesDetails = this.deliverablesForm.get(
            'deliverablesDetails'
        ) as FormArray;
        this.deliverablesDetails.push(this.createItem(val));
    }
    deleteDeliverables(i: any) {
        if (this.deliverablesDetails.length != 1) {
            const remove = this.deliverablesForm.get(
                'deliverablesDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createResponsibilty(val?, a?): FormGroup {
        return this.fs.group({
            role: [val],
            responsibility: [a],
        });
    }
    addResponsibilty(val?, a?) {
        this.rolesDetails = this.responsbilityForm.get(
            'rolesDetails'
        ) as FormArray;
        this.rolesDetails.push(this.createResponsibilty(val, a));
    }
    deleteResponsibilty(i: any) {
        if (this.rolesDetails.length != 1) {
            const remove = this.responsbilityForm.get(
                'rolesDetails'
            ) as FormArray;
            remove.removeAt(i);
        }
    }
    createPaymentItem(a?, b?, c?, d?): FormGroup {
        return this.fs.group({
            // item: ['', Validators.required],
            itemDescription: [a, Validators.required],
            totalCost: [b],
            unitPrice: [c, Validators.required],
            units: [d, Validators.required],
        });
    }
    addItem(a?, b?, c?, d?): void {
        this.items = this.praposalForm.get('items') as FormArray;
        this.items.push(this.createPaymentItem(a, b, c, d));
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
        if (
            this.praposalForm.invalid ||
            this.scopeForm.invalid ||
            this.deliverablesForm.invalid
        ) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        if (this.bankDetails == undefined) {
            this.snackBar.open('Please Select Bank Details', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let obj;
        if (this.modify) {
            obj = {
                proposalId: this.proposalId,
                ...this.praposalForm.value,
                ...this.scopeForm.value,
                ...this.deliverablesForm.value,
                ...this.responsbilityForm.value,
                totalWithOutTax: this.totalWithoutTax,
                tax: this.taxAmount,
                grandTotal: this.grandTotal,
                accountDetails: this.accountDetails,
                bankDetails: this.bankDetails,
            };
        } else {
            obj = {
                ...this.praposalForm.value,
                ...this.scopeForm.value,
                ...this.deliverablesForm.value,
                ...this.responsbilityForm.value,
                totalWithOutTax: this.totalWithoutTax,
                tax: this.taxAmount,
                grandTotal: this.grandTotal,
                accountDetails: this.accountDetails,
                bankDetails: this.bankDetails,
            };
        }
        console.log('obj', obj);
        this.spinner.show();
        this.adminService.createProposal(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.praposalForm.reset();
                this.scopeForm.reset();
                this.deliverablesForm.reset();
                this.responsbilityForm.reset();
                this.spinner.hide();
                this.router.navigateByUrl('/proposals');
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
                console.log(err);
            }
        );
    }
}
