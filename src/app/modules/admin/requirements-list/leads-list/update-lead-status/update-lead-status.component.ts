import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';

import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-update-lead-status',
    templateUrl: './update-lead-status.component.html',
    styleUrls: ['./update-lead-status.component.scss'],
})
export class UpdateLeadStatusComponent implements OnInit {
    createForm!: FormGroup;
    modifyData: any = this.data;
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
    leadsId: any;
    constructor(
        private matDialog: MatDialog,
        private dialogRef: MatDialogRef<UpdateLeadStatusComponent>,
        private snackBar: MatSnackBar,
        private adminservice: AdminService,
        private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        console.log('dhfd', this.modifyData);
        this.createForm = new FormGroup({
            prospectNote: new FormControl(''),
            leadNote: new FormControl(''),
            opportunityNote: new FormControl(''),
            closeNote: new FormControl(''),
        });
        if (this.modifyData) {
            this.leadsId = this.modifyData.Data._id;
            this.createForm.patchValue(this.modifyData.Data);
            if (
                this.modifyData.Data?.prospect == 'true' &&
                this.modifyData.Data?.lead != 'true' &&
                this.modifyData.Data?.opportunity != 'true' &&
                this.modifyData.Data?.close != 'true'
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
            this.leadstatus = this.modifyData.Data?.lead;
            if (
                this.modifyData.Data?.lead == 'true' &&
                this.modifyData.Data?.opportunity != 'true' &&
                this.modifyData.Data?.close != 'true'
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
            this.opportunitystatus = this.modifyData.Data?.opportunity;
            if (
                this.modifyData.Data?.opportunity == 'true' &&
                this.modifyData.Data?.close != 'true'
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
            this.closestatus = this.modifyData.Data?.close;
            if (this.modifyData.Data?.close == 'true') {
                this.showCloseNote = true;
            }
            if (
                this.modifyData.Data?.prospect == 'true' &&
                this.modifyData.Data?.lead == 'true'
            ) {
                this.selectedStatus = 'Lead';
            }
            if (
                this.modifyData.Data?.prospect == 'true' &&
                this.modifyData.Data?.lead == 'true' &&
                this.modifyData.Data?.opportunity == 'true'
            ) {
                this.selectedStatus = 'Opportunity';
            }
            if (
                this.modifyData.Data?.prospect == true &&
                this.modifyData.Data?.lead == true &&
                this.modifyData.Data?.opportunity == true &&
                this.modifyData.Data?.close
            ) {
                this.selectedStatus = 'Close';
            }
        }
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
    close() {
        this.dialogRef.close('close');
    }

    save() {
        let obj = {
            leadsId: this.leadsId,
            ...this.createForm.value,
            prospect: this.prospectstatus,
            lead: this.leadstatus,
            opportunity: this.opportunitystatus,
            close: this.closestatus,
        };
        this.spinner.show();
        this.adminservice.createLeads(obj).subscribe(
            (res: any) => {
                this.snackBar.open(res.message, 'Close', {
                    duration: 3000,
                });

                this.createForm.reset();
                this.dialogRef.close('submit');
                this.spinner.hide();
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                console.log(err);
                this.spinner.hide();
            }
        );
    }
}
