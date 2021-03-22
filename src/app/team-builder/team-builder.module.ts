import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamBuilderRoutingModule } from './team-builder-routing.module';
import { TeamBuilderComponent } from './pages/team-builder/team-builder.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TeamBuilderComponent
  ],
  imports: [
    SharedModule,
    TeamBuilderRoutingModule
  ]
})
export class TeamBuilderModule { }
