import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexOptions } from 'apexcharts';
import { AdminService } from 'app/core/admin/admin.service';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexGrid,
    ApexLegend,
    ApexMarkers,
    ApexStroke,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexYAxis,
    ChartComponent,
} from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';
export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    tooltip: any; // ApexTooltip;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    fill: ApexFill;
    title: ApexTitleSubtitle;
};

export type PieChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    title: ApexTitleSubtitle;
    legend: ApexLegend;
};
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public pieChartOptions: Partial<PieChartOptions>;
    chartVisitors: any = [];
    dashboardDetails: any;
    adminTabs = [
        // {
        //     name: 'All',
        // },
        {
            name: 'dev',
            label: 'Develpoment',
        },
        {
            name: 'digital',
            label: 'Digital Marketing',
        },
    ];
    role: any;
    tabName: any = 'dev';
    currencyName: any;
    getallcoutries: any;
    constructor(
        private adminService: AdminService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.getCountryDetails();
        this.currencyName = '6451fb8828010ebb35c7db79';
        this.getDashboarddetails();
        let adminData: any = JSON.parse(localStorage.getItem('adminData'));
        this.role = adminData.role;
        this.chartFunction('');

        this.pieChartFunction('');
    }
    getCountryDetails() {
        let pageParams;
        if (this.tabName) {
            pageParams = `?type=${this.tabName}`;
        }
        this.adminService
            .getTypeBasedCurrency(pageParams)
            .subscribe((res: any) => {
                this.getallcoutries = res.data;
            });
    }
    selectedCurrency(e: any) {
        this.currencyName = e;
        this.getDashboarddetails();
    }

    getDashboarddetails() {
        this.spinner.show();
        let pageparams;
        console.log('kfg', this.currencyName);
        pageparams = `?type=${this.tabName}&currency=${this.currencyName}`;

        this.adminService.getdashboard(pageparams).subscribe(
            (res: any) => {
                this.dashboardDetails = res.data;
                this.spinner.hide();
                this.pieChartFunction(this.dashboardDetails);
                this.chartFunction(this.dashboardDetails);
            },
            (err: any) => {
                console.log('err', err);
                this.spinner.hide();
            }
        );
    }
    tabClick(e: any) {
        this.tabName = e.tab.textLabel;
        if (e.tab.textLabel == 'All') {
            this.tabName = '';
        }
        this.getDashboarddetails();
        this.getCountryDetails();
    }
    chartFunction(chartData?) {
        this.chartOptions = {
            series: [
                {
                    name: 'Budget',
                    data: chartData.budgetGraph,
                    color: '#3b82f6',
                    type: 'line',
                },
                {
                    name: 'Paid',
                    data: chartData.paidGraph,
                    color: '#22c55e',
                    type: 'line',
                },
                {
                    name: 'Due',
                    data: chartData.dueGraph,
                    color: '#ef4444',
                    type: 'line',
                },
            ],

            chart: {
                height: 350,
                type: 'line',
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },

            stroke: {
                width: [3, 3, 3],
                curve: 'straight',
                // colors: ['#3b82f6', '#008000', '#FF0000'],
                // dashArray: [0, 8, 5],
            },
            title: {
                text: 'Payment Report',
                align: 'left',
            },
            legend: {
                tooltipHoverFormatter: function (val, opts) {
                    return (
                        val +
                        ' - <strong>' +
                        opts.w.globals.series[opts.seriesIndex][
                            opts.dataPointIndex
                        ] +
                        '</strong>'
                    );
                },
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6,
                },
                //colors: ['#3b82f6', '#008000', '#FF0000'],
            },
            xaxis: {
                labels: {
                    trim: false,
                },
                categories: chartData.monthGraph,
            },
            tooltip: {
                y: [
                    {
                        title: {
                            formatter: function (val) {
                                return val;
                            },
                        },
                    },
                    {
                        title: {
                            formatter: function (val) {
                                return val;
                            },
                        },
                    },
                    {
                        title: {
                            formatter: function (val) {
                                return val;
                            },
                        },
                    },
                ],
            },
            grid: {
                borderColor: '#f1f1f1',
            },
            fill: {
                opacity: [1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: 'vertical',
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100],
                },
            },
        };
    }
    pieChartFunction(chartData?) {
        this.pieChartOptions = {
            series: chartData.bud,
            chart: {
                width: 450,
                type: 'pie',
            },
            labels: chartData.countryName,
            title: {
                text: 'Country Report',
                align: 'left',
            },

            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 350,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
            legend: {
                show: true,

                position: 'bottom',
                horizontalAlign: 'center',

                labels: {
                    colors: undefined,
                    useSeriesColors: false,
                },
            },
        };
    }
}
