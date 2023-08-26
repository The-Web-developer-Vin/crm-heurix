import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateStatusComponent } from './update-status/update-status.component';


@NgModule({
    declarations: [UsersComponent, ChangePasswordComponent, AddUserComponent, UpdateStatusComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: UsersComponent,
            },
        ]),
        SharedModule,

    ],
})
export class UsersModule {}
