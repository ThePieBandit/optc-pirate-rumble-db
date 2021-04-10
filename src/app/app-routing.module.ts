import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./database/database.module').then(m => m.DatabaseModule),
  },
  {
    path: 'team-builder',
    loadChildren: () => import('./team-builder/team-builder.module').then(m => m.TeamBuilderModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
