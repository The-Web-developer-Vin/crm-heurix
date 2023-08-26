import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelieveLetterComponent } from './relieve-letter.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [RelieveLetterComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: RelieveLetterComponent,
            },
        ]),
    ],
})
export class RelieveLetterModule {}
