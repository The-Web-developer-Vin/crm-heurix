import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-seo-single',
    templateUrl: './seo-single.component.html',
    styleUrls: ['./seo-single.component.scss'],
})
export class SeoSingleComponent implements OnInit {
    seoId: any;
    details: any;
    constructor(
        private route: ActivatedRoute,
        private adminService: AdminService,
        private spinner: NgxSpinnerService
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.seoId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.getById();
    }
    getById() {
        this.spinner.show();
        this.adminService.getBySeoId(this.seoId).subscribe(
            (res: any) => {
                this.details = res.data.seo;
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
            pdf.save('SEO.pdf');
        });
    }
}
