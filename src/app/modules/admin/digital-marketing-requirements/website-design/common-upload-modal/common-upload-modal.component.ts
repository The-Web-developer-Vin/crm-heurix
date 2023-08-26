import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-common-upload-modal',
    templateUrl: './common-upload-modal.component.html',
    styleUrls: ['./common-upload-modal.component.scss'],
})
export class CommonUploadModalComponent implements OnInit {
    uploadFrom = this.data;
    logoData: boolean = false;
    contentFile: boolean = false;
    otherFiles: boolean = false;
    imageAttr = '';
    docAttr = '';
    otherAttr = '';
    file: File;
    image: any;
    contectDoc: any;
    otherDocuments: any;
    constructor(
        private dailogRef: MatDialogRef<CommonUploadModalComponent>,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any },
        private adminService: AdminService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        console.log('djsdf', this.uploadFrom);
        if (this.uploadFrom.Data == 'logo') {
            this.logoData = true;
        } else {
            this.logoData = false;
        }
        if (this.uploadFrom.Data == 'content') {
            this.contentFile = true;
        } else {
            this.contentFile = false;
        }
        if (this.uploadFrom.Data == 'other') {
            this.otherFiles = true;
        } else {
            this.otherFiles = false;
        }
    }
    close() {
        this.dailogRef.close('');
    }
    fileSelectedImage(event: any) {
        const file = Math.round(event.target.files[0].size / 1024);
        console.log('file', file);
        if (file > 30720) {
            this.snackBar.open('File size not more than 20mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }
        this.file = event.target.files[0];

        this.imageAttr = this.file.name;
        let formData = new FormData();
        formData.append('file', this.file);
        this.spinner.show();
        this.adminService.commonUpload(formData).subscribe(
            (res: any) => {
                this.image = res.data.upload[0];
                this.dailogRef.close(this.image);
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    fileSelectedDoc(event: any) {
        const file = Math.round(event.target.files[0].size / 1024);
        if (file > 30720) {
            this.snackBar.open('File size not more than 10mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        this.file = event.target.files[0];

        this.docAttr = this.file.name;

        let formData = new FormData();
        for (let i = 0; i < event.target.files.length; i++) {
            formData.append('file', event.target.files[i]);
        }
        this.spinner.show();
        this.adminService.commonUpload(formData).subscribe(
            (res: any) => {
                this.contectDoc = res.data.upload;
                this.dailogRef.close(this.contectDoc);
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    fileSelectedOther(event: any) {
        const file = Math.round(event.target.files[0].size / 1024);
        if (file > 30720) {
            this.snackBar.open('File size not more than 10mb', 'Close', {
                duration: 3000,
                panelClass: ['alert-red'],
            });
            return;
        }

        this.file = event.target.files[0];

        this.otherAttr = this.file.name;
        let formData = new FormData();
        for (let i = 0; i < event.target.files.length; i++) {
            formData.append('file', event.target.files[i]);
        }
        this.spinner.show();
        this.adminService.commonUpload(formData).subscribe(
            (res: any) => {
                this.otherDocuments = res.data.upload;
                this.dailogRef.close(this.otherDocuments);
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
}
