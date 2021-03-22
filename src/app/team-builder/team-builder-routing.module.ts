import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamBuilderComponent } from './pages/team-builder/team-builder.component';

const routes: Routes = [
  { path: '', component: TeamBuilderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamBuilderRoutingModule { }
