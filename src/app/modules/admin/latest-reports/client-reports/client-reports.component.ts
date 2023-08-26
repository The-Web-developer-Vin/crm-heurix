import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-client-reports',
    templateUrl: './client-reports.component.html',
    styleUrls: ['./client-reports.component.scss'],
})
export class ClientReportsComponent implements OnInit {
    @Output() _tabClickName = new EventEmitter();
    @Input() currencyName;
    @Input() yearNumber;
    @Input('filterDataClients') filterDataClients: Subject<any>;
    dataSourceClientLeft = new MatTableDataSource<Element>();
    dataSourceClientRight = new MatTableDataSource<Element>();
    displayColumnsClient = ['client', 'budget', 'paid', 'due'];
    displayColumnsClientRight = ['client', 'budget', 'paid', 'due'];
    loginId: any;
    role: any;
    tabName: any = 'dev';
    clientsData: any;
    clients1Data: any;
    adminTabs = [
        // {
        //     name: 'All',
        // },
        {
            name: 'dev',
            label: 'Development',
        },
        {
            name: 'digital',
            label: 'Digital Marketing',
        },
    ];
    currency: any;
    count: any;
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private changeDetector: ChangeDetectorRef
    ) {
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.loginId = adminData._id;
        this.role = adminData.role;
    }

    ngOnInit(): void {
        this.getDetails();
        this.filterDataClients.subscribe((e) => {
            this.currencyName = e.currencyName;
            this.yearNumber = e.yearNumber;
            this.getDetails();
        });
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;

        if (indexNumber.tab.textLabel == 'All') {
            this.tabName = '';
        }
        this._tabClickName.emit(this.tabName);
        this.filterDataClients.subscribe((e) => {
            this.currencyName = e.currencyName;
            this.yearNumber = e.yearNumber;
            this.getDetails();
        });
        this.getDetails();
    }
    getDetails() {
        let pageparams;
        pageparams = `?currency=${this.currencyName}`;
        if (this.tabName) {
            pageparams += `&type=${this.tabName}`;
        }
        if (this.yearNumber) {
            pageparams += `&year=${this.yearNumber}`;
        }
        this.spinner.show();
        this.adminService.getClientsReports(pageparams).subscribe(
            (res: any) => {
                this.changeDetector.detectChanges();
                this.count = res.clients;
                this.clientsData = res.client2;

                if (res.client2.length != 0) {
                    this.clientsData.push({
                        name: 'Total',
                        projects: res.clients2.client_projects,
                        project_budget: res.clients2.client_total,
                        totalPaid: res.clients2.client_paid,
                        due: res.clients2.client_due,
                    });
                }
                this.dataSourceClientLeft = res.client2;

                this.clients1Data = res.client1;
                if (res.client1.length != 0) {
                    this.clients1Data.push({
                        name: 'Total',
                        projects: res.clients1.client_projects,
                        project_budget: res.clients1.client_total,
                        totalPaid: res.clients1.client_paid,
                        due: res.clients1.client_due,
                    });
                }
                this.dataSourceClientRight = res.client1;
                this.currency = res.currency;
                this.spinner.hide();
            },
            (err: any) => {
                this.spinner.hide();
            }
        );
    }
}
