import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectManagementComponent } from './project-management.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AssignTasksComponent } from './assign-tasks/assign-tasks.component';
import { WorkingComponent } from './working/working.component';
import { CompletedComponent } from './completed/completed.component';
import { StoppedComponent } from './stopped/stopped.component';
import { UpdateStatusTaskComponent } from './update-status-task/update-status-task.component';
@NgModule({
    declarations: [ProjectManagementComponent, AssignTasksComponent, WorkingComponent, CompletedComponent, StoppedComponent, UpdateStatusTaskComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProjectManagementComponent,
            },
        ]),
    ],
})
export class ProjectManagementModule {}
