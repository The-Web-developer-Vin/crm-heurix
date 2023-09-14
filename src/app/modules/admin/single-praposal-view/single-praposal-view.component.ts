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
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
    downloadAsPDF() {
        const pdfCapture = this.pdfCapture.nativeElement;
        var html = htmlToPdfmake(pdfCapture.innerHTML);
        const documentDefinition = { content: html };
        pdfMake.createPdf(documentDefinition).open();
    }
    srcChange(src) {
        this.src = src;
    }

    clear() {
        this.clearMe = !this.clearMe;
    }

    save() {
        this.signing = false;
        let obj = {
            proposalId: this.proposalId,
            sign: this.src,
        };
        console.log('obj', obj);
    }

    resign() {
        this.clear();
        this.signing = true;
    }
}
