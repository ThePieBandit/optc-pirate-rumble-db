import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { TeamBuilderRoutingModule } from './team-builder-routing.module';
import { TeamBuilderComponent } from './pages/team-builder/team-builder.component';
import { SharedModule } from '../shared/shared.module';
import { UnitCardComponent } from './components/unit-card/unit-card.component';
import { UnitPickerComponent } from './components/unit-picker/unit-picker.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MdePopoverModule } from '@material-extended/mde';
import { TeamTotalsComponent } from './components/team-totals/team-totals.component';
import { UnitDetailsCardComponent } from './components/unit-details-card/unit-details-card.component';

@NgModule({
  declarations: [
    TeamBuilderComponent,
    UnitCardComponent,
    UnitPickerComponent,
    TeamTotalsComponent,
    UnitDetailsCardComponent
  ],
  imports: [
    SharedModule,
    TeamBuilderRoutingModule,
    MatGridListModule,
    MatSliderModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MdePopoverModule,
  ],
})
export class TeamBuilderModule { }
