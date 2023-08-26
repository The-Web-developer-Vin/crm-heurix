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
    selector: 'app-project-reports',
    templateUrl: './project-reports.component.html',
    styleUrls: ['./project-reports.component.scss'],
})
export class ProjectReportsComponent implements OnInit {
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
    role;
    details: any;
    loginId: any;
    dataSource = new MatTableDataSource<Element>();
    displayColumns = ['stream', 'budget', 'paid', 'due'];

    dataSourceCountry = new MatTableDataSource<Element>();
    @Input() yearNumber;
    @Input() monthnumber;
    @Input() currencyName;
    @Input('filterData') filterData: Subject<any>;
    @Output() _tabClickName = new EventEmitter();
    paymentData: any;
    techData: any;
    currency: any;
    tabName: any = 'dev';
    countryData: any;
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
        this.getMonthlyReports();
        this.filterData.subscribe((e) => {
            this.monthnumber = e.monthnumber;
            this.yearNumber = e.yearNumber;
            this.currencyName = e.currencyName;
            this.getMonthlyReports();
        });
    }
    tabClick(indexNumber) {
        this.tabName = indexNumber.tab.textLabel;
        if (indexNumber.tab.textLabel == 'All') {
            this.tabName = '';
        }
        this._tabClickName.emit(this.tabName);
        this.getMonthlyReports();
    }
    getMonthlyReports() {
        let pageparams;
        pageparams = `?year=${this.yearNumber}&month=${this.monthnumber}`;
        // if (this.monthnumber && this.yearNumber) {
        //     pageparams += `?year=${this.yearNumber}&month=${this.monthnumber}`;
        // }
        if (this.tabName) {
            pageparams += `&type=${this.tabName}`;
        }
        // if (this.currencyName) {
        //     pageparams += `&currency=${this.currencyName}`;
        // }
        this.spinner.show();
        this.adminService.getMonthlyReports(this.loginId, pageparams).subscribe(
            (res: any) => {
                this.changeDetector.detectChanges();
                this.countryData = res.country;
                this.dataSourceCountry = res.country;
                if (res.country.length != 0) {
                    this.countryData.push({
                        name: 'Total',
                        projects: res.countries.country_projects,
                        project_budget: res.countries.country_total,
                        totalPaid: res.countries.country_paid,
                        due: res.countries.country_due,
                    });
                }

                this.spinner.hide();
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
}
