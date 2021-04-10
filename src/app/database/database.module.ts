import { NgModule } from '@angular/core';

import { DatabaseRoutingModule } from './database-routing.module';
import { DatabaseComponent } from './pages/database/database.component';
import { FiltersComponent } from './components/filters/filters.component';
import { UnitTableComponent } from './components/unit-table/unit-table.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DatabaseComponent,
    FiltersComponent,
    UnitTableComponent,
  ],
  imports: [
    SharedModule,
    DatabaseRoutingModule,
    MatTableModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSidenavModule
  ]
})
export class DatabaseModule { }
