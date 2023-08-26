import { Component, Inject, OnInit } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AdminService } from 'app/core/admin/admin.service';
export interface PeriodicElement {
    position: number;
    backend: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, backend: 'fdsfjdf' },
    { position: 2, backend: 'fdsfjdf' },
];
@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
    backendempList: any;
    uiuxempList: any;
    checked: boolean = false;
    employeevalue: any = [];
    employeevalues: any = [];
    employeeData: any;
    employeearray: any = [];
    employeeslist: any;
    employeeslist2: any;
    uplift = 0;
    empname: any = [];
    empbname: any = [];
    employeelist: any = [];
    modifyData: any = this.data;
    emplist: any = [];

    displayedColumns: string[] = ['position', 'backend'];
    dataSource = ELEMENT_DATA;
    modifydataForemployeeList: any = [];

    constructor(
        private adminService: AdminService,
        public dialogRef: MatDialogRef<EmployeeListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.backendemployeeeList();
        this.uiuxemployeeList();
        this.emplist = JSON.parse(localStorage.getItem('employeeslist'));
        console.log("this.emplist===>",this.emplist)
        if (this.data) {
        
            this.backendempList?.forEach((element) => {
                console.log("element", element)
                this.data.forEach((ele) => {
                    if (element == ele.name) {
                        ele.checked = true;
                    }
                });
            });
        }

        //  this.modifydataForemployeeList=JSON.parse(localStorage.getItem('modifyData'));
        // console.log("this.modifydataForemployeeList",this.modifydataForemployeeList)
    }
    backendemployeeeList() {
        this.adminService.getbackentemp().subscribe((res: any) => {
            this.backendempList = res.data.employee;
            console.log("this.backendempList",this.backendempList)
            if (this.emplist) {
                // this.emplist = this.data
                this.emplist.forEach((element) => {
                    let dataName = element.name;

                    this.backendempList.forEach((element) => {
                        if (dataName == element.name) {
                            element.checked = true;
                        }
                    });
                });
            }
            if (this.data) {
                this.data.forEach((element) => {      
                    let dataName = element.name;
                    this.backendempList.forEach((element) => {
                        if (dataName == element.name) {
                            element.checked = true;
                        }
                    });
                });
            }
        });
    }
    uiuxemployeeList() {
        this.adminService.getuiuxemp().subscribe((res: any) => {
            this.uiuxempList = res.data.employee;
console.log("this.uiuxempList",this.uiuxempList)
            if (this.emplist) {
                // this.emplist = this.data
                this.emplist.forEach((element) => {
                    let dataName = element.name;

                    this.uiuxempList.forEach((element) => {
                        if (dataName == element.name) {
                            element.checked = true;
                            // this.empname = element.name;
                            // console.log(' this.empname', this.empname);
                        }
                    });
                });
            }
            if (this.data) {
                this.data.forEach((element) => {
                    let dataName = element.name;
                    console.log("dataName===>123",dataName)
                    this.uiuxempList.forEach((element) => {
                        console.log("element===>123",element.name)
                        if (dataName == element.name) {
                            element.checked = true;
                        }
                    });
                });
            }




        });
    }

    // yourfunc(e) {
    //     this.employeevalue = e.source.value;
    //     this.savevalues();
    // }
    // yourfuncs(e) {
    //     this.employeevalues = e.source.value;
    //     // console.log("e", this.employeevalue)
    //     this.savevalues();
    // }
    // savevalues() {
    //     this.employeearray.push(this.employeevalue, this.employeevalues);
    // }
    checkEmp(e, c) {
        console.log("checkEmp",e,c)
        if (c.checked) {
            console.log("c.checked",c.checked)
            this.employeearray.push(e);
            console.log("this.employeearray",this.employeearray)
        } else {
            var i = this.employeearray.indexOf(e);
            if (i > -1) {
                this.employeearray.splice(i, 1);
                console.log("this.employeearray",this.employeearray)
            }
        }
    }
    // checkEmps(e, c) {
    //     if (c.checked) {
    //         this.employeearray.push(e);
    //     } else {
    //         var i = this.employeearray.indexOf(e);
    //         if (i > -1) {
    //             this.employeearray.splice(i, 1);
    //         }
    //     }
    // }
    selectedEmp() {
        if (this.emplist) {
            // this.employeearray.push(this.emplist)
            this.employeearray = this.emplist;
        }
        this.dialogRef.close({ data: this.employeearray });
        console.log('fhhdf', this.employeearray);
if(this.employeearray){
    
}

       let data= localStorage.setItem(
            'employeeslist',
            JSON.stringify(this.employeearray)
        );
console.log("data",data)
        //  console.log("this.employeeslist-back",this.employeeslist2)

        // console.log(" localstorage-employee", localStorage.getItem('employeelist'))
    }
    close() {
        this.dialogRef.close();
    }
}
