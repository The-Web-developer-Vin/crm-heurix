import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MonthsPipe } from './pipe/months.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AmountToWordsPipe } from './pipe/amount-to-words.pipe';
import { MatSortModule } from '@angular/material/sort';
import { AlphabetOnlyDirective } from './directives/alphabet-only.directive';
import { NgxEditorModule } from 'ngx-editor';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatMenuModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTabsModule,
        NgApexchartsModule,
        MatTooltipModule,
        MatSortModule,
        NgxEditorModule,
        MatRadioModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatMenuModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTabsModule,
        NgApexchartsModule,
        MonthsPipe,
        MatTooltipModule,
        AmountToWordsPipe,
        MatSortModule,
        AlphabetOnlyDirective,
        NgxEditorModule,
        MatRadioModule,
    ],
    declarations: [MonthsPipe, AmountToWordsPipe, AlphabetOnlyDirective],
})
export class SharedModule {}
