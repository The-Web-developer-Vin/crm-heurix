import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';

@Component({
    selector: 'app-print-fee',
    templateUrl: './print-fee.component.html',
    styleUrls: ['./print-fee.component.scss'],
})
export class PrintFeeComponent implements OnInit {
    AmountValue = 30000;
    milstoneId: any;
    details: any;
    personalDetails: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,

        private adminService: AdminService
    ) {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.milstoneId = res.id;
            }
        });
    }

    ngOnInit(): void {
        this.getDetails();
    }
    getDetails() {
        this.adminService
            .getMilstoneByTraineeId(this.milstoneId)
            .subscribe((res: any) => {
                console.log('res', res);
                this.details = res.data;
                this.personalDetails = res.data.traineeId;
            });
    }
    printPage() {
        window.print();
    }
}
