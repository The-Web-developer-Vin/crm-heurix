import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';

@Component({
    selector: 'app-trainee-certificate',
    templateUrl: './trainee-certificate.component.html',
    styleUrls: ['./trainee-certificate.component.scss'],
})
export class TraineeCertificateComponent implements OnInit {
    traineeId: any;
    details: any;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private adminService: AdminService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.traineeId = res.id;

                this.getDetails();
            }
        });
    }
    printPage() {
        window.print();
    }
    getDetails() {
        this.adminService
            .traineeGetById(this.traineeId)
            .subscribe((res: any) => {
                this.details = res.data.trainee;
            });
    }
}
