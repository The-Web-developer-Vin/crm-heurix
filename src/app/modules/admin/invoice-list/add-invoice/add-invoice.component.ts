import { Component, Inject, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
    selector: 'app-add-invoice',
    templateUrl: './add-invoice.component.html',
    styleUrls: ['./add-invoice.component.scss'],
})
export class AddInvoiceComponent implements OnInit {
    invoiceForm!: FormGroup;
    details: FormArray;

    editor: Editor;
    html: '';
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
        private adminService: AdminService,
        private matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        this.editor = new Editor();
        this.invoiceForm = new FormGroup({
            GST: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            invoiceDescription: new FormControl('', Validators.required),
            details: new FormArray([]),
        });
        // this.invoiceForm.get('details').valueChanges.subscribe((res) => {
        //     let amount = 0;
        //     res.forEach((element: any, index) => {
        //         amount = element.unitPrice + element.tax;
        //         // amount += element.unitPrice * element.tax;
        //     });
        //     this.invoiceForm.get('total').setValue(amount);
        // });
        this.addItem();
    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }
    total(event, index) {
        let res =
            +this.details.at(index).get('unitPrice').value +
            +this.details.at(index).get('tax').value;
        this.details.at(index).get('total').setValue(res);
    }

    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    createItem(): FormGroup {
        return this.formBuilder.group({
            description: ['', Validators.required],
            unitPrice: ['', Validators.required],
            tax: ['', Validators.required],
            total: ['', Validators.required],
        });
    }
    addItem(): void {
        this.details = this.invoiceForm.get('details') as FormArray;
        this.details.push(this.createItem());
    }
    removeItem(index: any) {
        console.log('dfk', this.details.length);
        if (this.details.length > 1) {
            this.details.removeAt(index);
        }
        // if (index == 0) {
        //     return;
        // }
        // this.details = this.invoiceForm.get('details') as FormArray;

        //(<FormArray>this.createSalesForm.controls.sale).removeAt(index);
    }
    close() {
        this.matDialog.closeAll();
    }
    save() {
        if (this.invoiceForm.invalid) {
            this.snackBar.open('Invalid Form', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        const data = {
            ...this.invoiceForm.value,
        };
        this.adminService.createInvoice(data).subscribe(
            (res: any) => {
                this.matDialog.closeAll();
                this.snackBar.open('Created Invoice Successfully.', 'Close', {
                    duration: 3000,
                });

                this.router.navigateByUrl('/invoice/print');
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
