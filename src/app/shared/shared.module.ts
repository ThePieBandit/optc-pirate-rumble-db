import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DecoratePipe } from './pipes/decorate.pipe';
import { EffectPipe } from './pipes/effect.pipe';
import { MarkedPipe } from './pipes/marked.pipe';
import { ChangelogComponent } from './components/changelog/changelog.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ChangelogComponent,
    DecoratePipe,
    EffectPipe,
    MarkedPipe,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatCardModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatCardModule,
    ChangelogComponent,
    DecoratePipe,
    EffectPipe,
    MarkedPipe,
    TruncatePipe,
  ]
})
export class SharedModule { }
