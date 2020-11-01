import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { FiltersComponent } from './filters/filters.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { OptionBarComponent } from './option-bar/option-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    FiltersComponent,
    ChangelogComponent,
    OptionBarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
