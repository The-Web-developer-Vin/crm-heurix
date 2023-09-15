import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2pdf from 'html2pdf.js';
@Component({
    selector: 'app-single-praposal-view',
    templateUrl: './single-praposal-view.component.html',
    styleUrls: ['./single-praposal-view.component.scss'],
})
export class SinglePraposalViewComponent implements OnInit {
    @ViewChild('pdfCapture') pdfCapture: ElementRef;
    proposalId: any;
    proposalDetails: any;

    public src: string;
    public clearMe = false;
    public signing = true;
    baseUrl: any;
    selectedCountry: any;
    sign: any;
    base64Image: string = 'your_base64_image_string_here';
    binaryData: Uint8Array | undefined;
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
        this.activatedRoute.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.proposalId = res.id;
                this.getData();
            }
        });
    }

    ngOnInit(): void {
        this.getData();
        this.baseUrl = environment.imageUrl;
    }
    getData() {
        this.spinner.show();
        this.adminService.getByProposalId(this.proposalId).subscribe(
            (res: any) => {
                this.proposalDetails = res.data.proposal;
                this.selectedCountry = res.data.proposal.country;
                if (res.data.proposal.signature) {
                    this.signing = false;
                    this.src = res.data.proposal.signature;
                } else {
                    this.signing = true;
                }
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    downloadAsPDF() {
        // const pdfCapture = this.pdfCapture.nativeElement;
        // var html = htmlToPdfmake(pdfCapture.innerHTML);
        // const documentDefinition = {
        //     content: html,
        // };
        // pdfMake.createPdf(documentDefinition).open();
        const content: HTMLElement = document.querySelector('#pdfCapture');

        const opt = {
            margin: 0,
            filename: 'proposal.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().from(content).set(opt).save();
    }
    srcChange(src) {
        this.src = src;
        this.base64Image = src;

        // const fileName = this.proposalDetails.clientName + '.png';
        // this.convertBase64ToFile(this.base64Image, fileName);
    }
    // convertBase64ToFile(base64Data: string, fileName: string) {
    //     const byteCharacters = atob(base64Data.split(',')[1]);
    //     const byteArrays = [];

    //     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    //         const slice = byteCharacters.slice(offset, offset + 512);
    //         const byteNumbers = new Array(slice.length);

    //         for (let i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //         }

    //         const byteArray = new Uint8Array(byteNumbers);
    //         byteArrays.push(byteArray);
    //     }

    //     const blob = new Blob(byteArrays, { type: 'image/png' });

    //     const file = new File([blob], fileName, { type: blob.type });
    //     let formData = new FormData();
    //     formData.append('file', file);
    //     this.adminService.commonUpload(formData).subscribe(
    //         (res: any) => {
    //             this.sign = res.data.upload[0];
    //         },
    //         (err: any) => {}
    //     );
    // }

    clear() {
        this.clearMe = !this.clearMe;
    }

    save() {
        this.signing = false;
        let obj = {
            proposalId: this.proposalId,
            signature: this.src,
        };
        console.log('obj', obj);
        this.spinner.show();
        this.adminService.signatureUpdate(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.getData();
                this.spinner.hide();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                this.spinner.hide();
            }
        );
    }

    resign() {
        this.clear();
        this.signing = true;
    }
}
