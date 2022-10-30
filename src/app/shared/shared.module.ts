import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DecoratePipe } from './pipes/decorate.pipe';
import { EffectPipe } from './pipes/effect.pipe';
import { MarkedPipe } from './pipes/marked.pipe';
import { ChangelogComponent } from './components/changelog/changelog.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { UnitFilterPipe } from './pipes/unit-filter.pipe';
import { ClassPickerComponent } from './components/class-picker/class-picker.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TypePickerComponent } from './components/type-picker/type-picker.component';
import { MatButtonModule } from '@angular/material/button';
import { PatternPipe } from './pipes/pattern.pipe';
import { ResiliencePipe } from './pipes/resilience-pipe';
import { TargetPriorityPipe } from './pipes/target-priority-pipe';  
import { BuffPickerComponent } from './components/buff-picker/buff-picker.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ConditionPipe } from './pipes/condition.pipe';

@NgModule({
  declarations: [
    ChangelogComponent,
    DecoratePipe,
    EffectPipe,
    ConditionPipe,
    MarkedPipe,
    TruncatePipe,
    UnitFilterPipe,
    ClassPickerComponent,
    TypePickerComponent,
    PatternPipe,
    ResiliencePipe,
    TargetPriorityPipe,
    BuffPickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    ChangelogComponent,
    DecoratePipe,
    EffectPipe,
    ConditionPipe,
    MarkedPipe,
    TruncatePipe,
    UnitFilterPipe,
    PatternPipe,
    ResiliencePipe,
    TargetPriorityPipe,
    ClassPickerComponent,
    TypePickerComponent,
    BuffPickerComponent,
  ]
})
export class SharedModule { }
