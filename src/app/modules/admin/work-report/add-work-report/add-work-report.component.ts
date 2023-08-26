import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'app/core/admin/admin.service';

@Component({
    selector: 'app-add-work-report',
    templateUrl: './add-work-report.component.html',
    styleUrls: ['./add-work-report.component.scss'],
})
export class AddWorkReportComponent implements OnInit {
    createForm!: FormGroup;
    modify: boolean = false;
    modifyData: any = this.data;
    selectType: any;
    accounts: any;
    getTechnologylist: any = [];
    clientType: any;
    clientslist: any;
    startTimes: any = [];
    endTime: any = [];
    constructor(
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<AddWorkReportComponent>,
        private matDialog: MatDialog,
        private adminService: AdminService,
        @Inject(MAT_DIALOG_DATA)
        private data: { Data: any }
    ) {}

    ngOnInit(): void {
        this.getTechnologyList();
        this.getClients();
        this.createForm = new FormGroup({
            type: new FormControl('', Validators.required),
            accountName: new FormControl('', Validators.required),
            clientName: new FormControl('', Validators.required),
            // time: new FormControl('', Validators.required),
            jobRoll: new FormControl('', Validators.required),
            meridian: new FormControl('', Validators.required),
            minutes: new FormControl('', Validators.required),
            hours: new FormControl('', Validators.required),
            endMeridian: new FormControl('', Validators.required),
            endMinutes: new FormControl('', Validators.required),
            endHours: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
        });

        if (this.modifyData) {
            this.modify = true;
            console.log('modify', this.modifyData);
            this.createForm.patchValue(this.modifyData.Data);
            this.createForm.patchValue({
                type: this.modifyData.Data.type,
                clientName: this.modifyData.Data.client._id,
                hours: this.modifyData.Data.startTimes[0].hours.toString(),
                minutes: this.modifyData.Data.startTimes[0].minutes.toString(),
                meridian:
                    this.modifyData.Data.startTimes[0].meridian.toString(),
                endHours: this.modifyData.Data.endTime[0].endHours.toString(),
                endMinutes:
                    this.modifyData.Data.endTime[0].endMinutes.toString(),
                endMeridian:
                    this.modifyData.Data.endTime[0].endMeridian.toString(),
                // account:this.modifyData.Data.account,
                // technology:this.modifyData.Data.technology._id,
            });

            if (this.modifyData.Data.type == 'Other') {
                this.clientType = this.modifyData.Data.type;
                delete this.createForm.value.accountName;
            } else if (
                this.modifyData.Data.type == 'clientChat' ||
                this.modifyData.Data.type == 'clientCall'
            ) {
                this.clientType = this.modifyData.Data.type;
                delete this.createForm.value.jobRoll;
            }
        }
    }
    selectedclientType(e: any) {
        this.clientType = e;
        console.log('e', e);
        if (e == 'clientCall' || e == 'clientChat') {
            delete this.createForm.value.jobRoll;
        } else if (e == 'Other') {
            delete this.createForm.value.accountName;
        }
    }

    close() {
        this.dialogRef.close('close');
    }
    getClients() {
        this.adminService.getclients('').subscribe((res: any) => {
            this.clientslist = res.data[0].data;
        });
    }

    getTechnologyList() {
        this.adminService.getStream('').subscribe((res: any) => {
            this.getTechnologylist = res.data[0].data;
        });
    }
    save() {
        //   if (this.createForm.invalid) {
        //     this.snackBar.open('Invalid Form', 'Close', {
        //         duration: 3000,
        //         panelClass: ['alert-red'],
        //     });
        //     return;
        // }
        (this.startTimes = [
            {
                hours: this.createForm.value.hours,
                minutes: this.createForm.value.minutes,
                meridian: this.createForm.value.meridian,
            },
        ]),
            (this.endTime = [
                {
                    endHours: this.createForm.value.endHours,
                    endMinutes: this.createForm.value.endMinutes,
                    endMeridian: this.createForm.value.endMeridian,
                },
            ]);
        if (this.modifyData) {
            if (this.createForm.value.type == 'Other') {
                this.createForm.value.accountName = '';
                delete this.createForm.value.accountName;
                console.log('res', this.createForm.value.jobRoll);
            }
            if (
                this.createForm.value.type == 'clientCall' ||
                this.createForm.value.type == 'clientChat'
            ) {
                this.createForm.value.jobRoll = '';
                delete this.createForm.value.jobRoll;
            }
            (this.startTimes = [
                {
                    hours: this.createForm.value.hours,
                    minutes: this.createForm.value.minutes,
                    meridian: this.createForm.value.meridian,
                },
            ]),
                (this.endTime = [
                    {
                        endHours: this.createForm.value.endHours,
                        endMinutes: this.createForm.value.endMinutes,
                        endMeridian: this.createForm.value.endMeridian,
                    },
                ]);
            let obj = {
                id: this.modifyData.Data._id,
                clientName: this.createForm.value.clientName,
                accountName: this.createForm.value.accountName,
                jobRoll: this.createForm.value.jobRoll,
                type: this.createForm.value.type,
                startTimes: this.startTimes,
                endTime: this.endTime,
                status: this.createForm.value.status,
            };
            this.adminService.updateWorkReport(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });

                    this.createForm.reset();
                    this.dialogRef.close('submit');
                },
                (err: any) => {
                    this.snackBar.open(err.error.message, 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                    console.log(err);
                }
            );
        } else {
            if (this.createForm.value.type == 'Other') {
                delete this.createForm.value.accountName;
                console.log('res', this.createForm.value.jobRoll);
            }
            if (
                this.createForm.value.type == 'clientCall' ||
                this.createForm.value.type == 'clientChat'
            ) {
                delete this.createForm.value.jobRoll;
            }

            let obj = {
                clientName: this.createForm.value.clientName,
                accountName: this.createForm.value.accountName,
                jobRoll: this.createForm.value.jobRoll,
                type: this.createForm.value.type,
                startTimes: this.startTimes,
                endTime: this.endTime,
                status: this.createForm.value.status,
            };

            this.adminService.createDailyUpdate(obj).subscribe(
                (res: any) => {
                    this.snackBar.open(res.message, 'Close', {
                        duration: 3000,
                    });
                    this.dialogRef.close('submit');
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
}
