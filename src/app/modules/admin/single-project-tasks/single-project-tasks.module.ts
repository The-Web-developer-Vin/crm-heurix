import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleProjectTasksComponent } from './single-project-tasks.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { InprogressListComponent } from './inprogress-list/inprogress-list.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { OnholdListComponent } from './onhold-list/onhold-list.component';
import { CompletedListComponent } from './completed-list/completed-list.component';

@NgModule({
    declarations: [
        SingleProjectTasksComponent,
        TodoListComponent,
        InprogressListComponent,
        UpdateTaskComponent,
        OnholdListComponent,
        CompletedListComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SingleProjectTasksComponent,
            },
        ]),
    ],
})
export class SingleProjectTasksModule {}
