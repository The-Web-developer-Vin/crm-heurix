import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-relieve-letter',
    templateUrl: './relieve-letter.component.html',
    styleUrls: ['./relieve-letter.component.scss'],
})
export class RelieveLetterComponent implements OnInit {
    empId: any;
    employeeData;
    currentDate: any;
    constructor(
        public route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private adminService: AdminService
    ) {
        this.empId = this.route.snapshot.params?.['id'];
    }

    ngOnInit(): void {
        this.currentDate = new Date();

        this.getbyemployeeid();
    }
    getbyemployeeid() {
        this.spinner.show();
        this.adminService.getbyEmployeeId(this.empId).subscribe(
            (res: any) => {
                this.employeeData = res.data.employee;
                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    printPage() {
        window.print();
    }
    downloadAsPDFRelieve() {
        var data = document.getElementById('section-to-print');
        html2canvas(data).then((canvas) => {
            const imgWidth = 208;
            var pageHeight = 295;
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
            pdf.save('relieve-letter.pdf');
        });
    }
}
