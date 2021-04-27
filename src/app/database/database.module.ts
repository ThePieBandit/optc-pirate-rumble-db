import { NgModule } from '@angular/core';

import { DatabaseRoutingModule } from './database-routing.module';
import { DatabaseComponent } from './pages/database/database.component';
import { FiltersComponent } from './components/filters/filters.component';
import { UnitTableComponent } from './components/unit-table/unit-table.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '../shared/shared.module';
import { UnitTableDataSource } from './services/unit-table-datasource';
import UnitService from '../core/services/unit.service';

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
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
  ],
  providers: [
    UnitTableDataSource,
    UnitService,
  ]
})
export class DatabaseModule { }
