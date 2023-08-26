import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceLetterComponent } from './experience-letter.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [ExperienceLetterComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: ExperienceLetterComponent,
            },
        ]),
    ],
})
export class ExperienceLetterModule {}
