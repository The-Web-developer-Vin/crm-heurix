import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-generate-invoice',
    templateUrl: './generate-invoice.component.html',
    styleUrls: ['./generate-invoice.component.scss'],
})
export class GenerateInvoiceComponent implements OnInit {
    myDate;
    invoiceId: any;
    invoiceDetails: any;
    selectedCountry: any;
    invoiceAddress: any = [];
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private activatedRoute: ActivatedRoute
    ) {
        this.myDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd');
        this.activatedRoute.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.invoiceId = res.id;
                this.getData();
            }
        });
    }

    ngOnInit(): void {}
    getData() {
        this.spinner.show();
        this.adminService.getByInvoiceId(this.invoiceId).subscribe(
            (res: any) => {
                this.invoiceDetails = res.data.invoice;

                this.invoiceAddress =
                    this.invoiceDetails?.billingAddress?.split('\n');
                this.selectedCountry = res.data.invoice.country;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }

    print() {
        window.print();
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    downloadAsPDF() {
        var data = document.getElementById('requirementDetails');
        html2canvas(data).then((canvas) => {
            const imgWidth = 211;
            var pageHeight = 230;
            var imgHeight = (canvas.height * imgWidth) / canvas.width;
            var heightLeft = imgHeight;
            const contentDataURL = canvas.toDataURL('image/png');
            let pdf = new jsPDF('p', 'mm', 'a4');
            var position = 0;
            pdf.addImage(
                contentDataURL,
                'PNG',
                0,
                position,
                imgWidth,
                imgHeight
            );
            heightLeft -= pageHeight;
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                // pdf.addPage();
                // pdf.addImage(
                //     contentDataURL,
                //     'PNG',
                //     0,
                //     position,
                //     imgWidth,
                //     imgHeight
                // );
                heightLeft -= pageHeight;
            }
            pdf.save(this.invoiceDetails?.invoiceId + '.pdf');
        });
    }
}
