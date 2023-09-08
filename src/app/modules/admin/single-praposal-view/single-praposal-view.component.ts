import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-single-praposal-view',
    templateUrl: './single-praposal-view.component.html',
    styleUrls: ['./single-praposal-view.component.scss'],
})
export class SinglePraposalViewComponent implements OnInit {
    @ViewChild('pdfCapture') pdfCapture: ElementRef;
    proposalId: any;
    proposalDetails: any;
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private activatedRoute: ActivatedRoute
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
    }
    getData() {
        this.spinner.show();
        this.adminService.getByInvoiceId(this.proposalId).subscribe(
            (res: any) => {
                this.proposalDetails = res.data.invoice;

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
}
