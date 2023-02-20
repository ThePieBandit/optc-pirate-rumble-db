import { Component, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { buffs } from '@core/constants/effects';
import { classes, types } from '@core/constants/units';
import { Attribute, Effect, TargetElement } from '@shared/models/rumble';

@Component({
  selector: 'app-buff-builder',
  templateUrl: './buff-builder.component.html',
  styleUrls: ['./buff-builder.component.css']
})
export class BuffBuilderComponent implements OnInit {

  targets: TargetElement[];

  effect: Effect;
  attributes: Attribute[];

  constructor(
    private dialogRef: MatDialogRef<BuffBuilderComponent, Effect>,
  ) {
    this.targets = types.concat(classes) as TargetElement[];
    this.attributes = [...buffs];
    this.effect = {
      level: 0,
      effect: 'buff',
      attributes: [],
      targeting: {
        targets: []
      },
    };
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.effect);
  }

  updatePreview() {
    this.effect = Object.assign({}, this.effect);
  }
}
