import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-leads-single',
    templateUrl: './leads-single.component.html',
    styleUrls: ['./leads-single.component.scss'],
})
export class LeadsSingleComponent implements OnInit {
    leadId: any;
    details: any;
    constructor(
        private route: ActivatedRoute,
        private adminService: AdminService,
        private spinner: NgxSpinnerService
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.leadId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.getById();
    }
    getById() {
        this.spinner.show();
        this.adminService.getByLeads(this.leadId).subscribe(
            (res: any) => {
                this.details = res.data.leads;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
                console.log('err', err);
            }
        );
    }
    downloadAsPDF() {
        var data = document.getElementById('requirementDetails');
        html2canvas(data).then((canvas) => {
            const imgWidth = 208;
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
                pdf.addPage();
                pdf.addImage(
                    contentDataURL,
                    'PNG',
                    0,
                    position,
                    imgWidth,
                    imgHeight
                );
                heightLeft -= pageHeight;
            }
            pdf.save('Details.pdf');
        });
    }
}
