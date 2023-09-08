import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/core/admin/admin.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseDrawerComponent } from '@fuse/components/drawer';

@Component({
    selector: 'app-invoice-list',
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
    @ViewChild('settingsDrawer', { static: true }) drawer: FuseDrawerComponent;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns = [
        'position',
        'id',
        'client',
        'email',
        'address',
        'date',
        'actions',
    ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();

    public pageSize = 10;
    pageLength: any;
    pageNumber = 1;
    searchName: any;
    sendMailForm: FormGroup;
    editor: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],

        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    public separatorKeysCodes = [ENTER, COMMA];
    public emailList = [];
    removable = true;
    file: File;
    uploadedFiles: any = [];
    // @ViewChild('settingsDrawer')
    // settingsDrawer: ElementRef;
    invoiceId: any;
    sortValue = 1;
    sort: any = '';
    constructor(
        private matDialog: MatDialog,
        private adminService: AdminService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private snackBar: MatSnackBar
    ) {}

    addMail(event): void {
        if (event.value) {
            if (this.validateEmail(event.value)) {
                this.emailList.push({ mail: event.value, invalid: false });
            } else {
                this.emailList.push({ mail: event.value, invalid: true });
                this.sendMailForm.controls['email'].setErrors({
                    incorrectEmail: true,
                });
            }
        }
        if (event.input) {
            event.input.value = '';
        }
    }

    removeEmail(data: any): void {
        if (this.emailList.indexOf(data) >= 0) {
            this.emailList.splice(this.emailList.indexOf(data), 1);
        }
    }
    ngOnInit(): void {
        this.editor = new Editor();
        this.getData();
        this.sendMailForm = new FormGroup({
            email: new FormControl([], [this.validateArrayNotEmpty]),
            subject: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required),
        });
    }

    private validateArrayNotEmpty(c: FormControl) {
        if (c.value && c.value.length === 0) {
            return {
                validateArrayNotEmpty: { valid: false },
            };
        }
        return null;
    }
    doFilter(value: any) {
        this.searchName = value;

        this.getData();
    }
    sorting(e: any, value: any) {
        this.sort = value;
        this.getData();
    }
    getData() {
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

        if (this.searchName) {
            pageparams += `&search=${this.searchName}`;
        }
        if (this.sort) {
            pageparams += `&sort=${this.sort}&sortValue=${this.sortValue}`;
        }
        this.spinner.show();
        this.adminService.getInvoiceList(pageparams).subscribe(
            (res: any) => {
                if (res.data.invoice[0].data.length == 0) {
                    this.spinner.hide();
                }
                this.dataSource = res.data.invoice[0].data;
                this.pageLength = res.data.invoice[0].pagination[0]?.total;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    add() {
        this.router.navigate([]).then((result) => {
            window.open(`/invoices/create`, '_blank');
        });
    }
    viewSingle(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/invoice/print?id=${data._id} `, '_blank');
        });
    }
    fileSelected(e: any) {
        const file = Math.round(e.target.files[0].size / 1024);
        if (file > 30720) {
            this.snackBar.open('File size not more than 30mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        let formData = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append('file', e.target.files[i]);
        }
        this.spinner.show();
        this.adminService.commonUpload(formData).subscribe(
            (res: any) => {
                this.uploadedFiles = res.data.upload;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    deleteFile(i: any) {
        this.uploadedFiles.splice(i, 1);
    }
    edit(data: any) {
        this.router.navigate([]).then((result) => {
            window.open(`/invoices/create?id=${data._id}`, '_blank');
        });
    }

    private validateEmail(email) {
        var re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    OpenSettingsDrawer(data) {
        this.invoiceId = data._id;
        this.emailList.push({ mail: data.clientMail, invalid: false });
    }
    close() {
        this.sendMailForm.reset();
        this.emailList.length = 0;
        this.uploadedFiles.length = 0;
    }
    sendMail() {
        let obj = {
            invoiceId: this.invoiceId,
            ...this.sendMailForm.value,
            email: this.emailList,
            fileUpload: this.uploadedFiles,
        };
        console.log('fjg', obj);
        this.spinner.show();
        this.adminService.sendEmail(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.sendMailForm.reset();
                this.uploadedFiles.length = 0;
                this.emailList.length = 0;
                this.drawer.close();
                this.getData();
                this.spinner.hide();
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
