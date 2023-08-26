import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/core/admin/admin.service';
import { elementAt } from 'rxjs';

@Component({
    selector: 'app-leads',
    templateUrl: './leads.component.html',
    styleUrls: ['./leads.component.scss'],
})
export class LeadsComponent implements OnInit {
    leadsForm!: FormGroup;
    getallpaids: any;
    getallcoutries: any;
    modify: boolean = false;
    leadsId: any;
    showProspectNote: boolean = false;
    showLeadNote: boolean = false;
    showOppurNote: boolean = false;
    showCloseNote: boolean = false;
    prospectstatus;
    leadstatus;
    opportunitystatus;
    closestatus;
    selectedStatus: any = '';
    statusList: any = [
        {
            name: 'Prospect',
            value: 'Prospect',
        },
    ];
    successMsgShow: boolean = false;
    constructor(
        private snackBar: MatSnackBar,
        private adminService: AdminService,
        private router: Router,
        private route: ActivatedRoute,
        private fs: FormBuilder
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((res: any) => {
            if (res.id) {
                this.leadsId = res.id;
                this.getById();
            }
        });
        this.leadsForm = new FormGroup({
            clientName: new FormControl('', Validators.required),
            mail: new FormControl('', Validators.email),
            phoneNumber: new FormControl(''),
            address: new FormControl(''),
            projectUrl: new FormControl('', [
                Validators.pattern(
                    '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
                ),
            ]),
            projectName: new FormControl(''),
            leadThrough: new FormControl(''),
            //  status: new FormControl(''),
            country: new FormControl(''),
            prospectNote: new FormControl(''),
            leadNote: new FormControl(''),
            opportunityNote: new FormControl(''),
            closeNote: new FormControl(''),
        });
        this.getHired();
        this.getallCountries();
    }
    getById() {
        this.modify = true;
        this.adminService.getByLeads(this.leadsId).subscribe((res: any) => {
            this.leadsForm.patchValue(res.data.leads);
            this.leadsForm.patchValue({
                country: res.data.leads.country._id,
                leadThrough: res.data.leads.leadThrough._id,
            });
            this.prospectstatus = res.data.leads.prospect;
            if (
                res.data.leads.prospect == true &&
                res.data.leads.lead != true &&
                res.data.leads.opportunity != true &&
                res.data.leads.close != true
            ) {
                this.showProspectNote = true;
                this.selectedStatus = 'Prospect';
                this.statusList = [
                    {
                        name: 'Prospect',
                        value: 'Prospect',
                    },
                    {
                        name: 'Lead',
                        value: 'Lead',
                    },
                ];
            }
            this.leadstatus = res.data.leads.lead;
            if (
                res.data.leads.lead == true &&
                res.data.leads.opportunity != true &&
                res.data.leads.close != true
            ) {
                this.showLeadNote = true;
                this.statusList = [
                    {
                        name: 'Lead',
                        value: 'Lead',
                    },
                    {
                        name: 'Opportunity',
                        value: 'Opportunity',
                    },
                ];
            }
            this.opportunitystatus = res.data.leads.opportunity;
            if (
                res.data.leads.opportunity == true &&
                res.data.leads.close != true
            ) {
                this.showOppurNote = true;
                this.statusList = [
                    {
                        name: 'Opportunity',
                        value: 'Opportunity',
                    },
                    {
                        name: 'Close',
                        value: 'Close',
                    },
                ];
            }
            this.closestatus = res.data.leads.close;
            if (res.data.leads.close == true) {
                this.showCloseNote = true;
            }
            if (
                res.data.leads.prospect == true &&
                res.data.leads.lead == true
            ) {
                this.selectedStatus = 'Lead';
            }
            if (
                res.data.leads.prospect == true &&
                res.data.leads.lead == true &&
                res.data.leads.opportunity == true
            ) {
                this.selectedStatus = 'Opportunity';
            }
            if (
                res.data.leads.prospect == true &&
                res.data.leads.lead == true &&
                res.data.leads.opportunity == true &&
                res.data.leads.close
            ) {
                this.selectedStatus = 'Close';
            }
        });
    }
    getStatus(e: any) {
        if (e == 'Prospect') {
            this.showProspectNote = true;
            this.prospectstatus = true;
        } else {
            this.showProspectNote = false;
        }
        if (e == 'Lead') {
            this.showLeadNote = true;
            this.leadstatus = true;
        } else {
            this.showLeadNote = false;
        }
        if (e == 'Opportunity') {
            this.showOppurNote = true;
            this.opportunitystatus = true;
        } else {
            this.showOppurNote = false;
        }
        if (e == 'Close') {
            this.showCloseNote = true;
            this.closestatus = true;
        } else {
            this.showCloseNote = false;
        }
    }
    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    getallCountries() {
        this.adminService.getCountries('').subscribe((res: any) => {
            this.getallcoutries = res.data[0].data;
        });
    }

    getHired() {
        this.adminService.getHiredIn('').subscribe((res: any) => {
            this.getallpaids = res.data[0].data;
        });
    }
    save() {
        let obj;
        if (this.modify) {
            obj = {
                leadsId: this.leadsId,
                ...this.leadsForm.value,
                prospect: this.prospectstatus,
                lead: this.leadstatus,
                opportunity: this.opportunitystatus,
                close: this.closestatus,
            };
        } else {
            obj = {
                ...this.leadsForm.value,
                prospect: this.prospectstatus,
                lead: this.leadstatus,
                opportunity: this.opportunitystatus,
                close: this.closestatus,
            };
        }
        console.log('obj', obj);
        this.adminService.createLeads(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });
                this.successMsgShow = true;
                setTimeout(() => {
                    this.router.navigateByUrl('/leads');
                }, 10000);
                //this.leadsForm.reset();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                console.log(err);
            }
        );
    }
}
