import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attribute } from '@shared/models/rumble';
import { buffs, debuffs, SpecialEffect } from 'src/app/core/constants/effects';
import { effectImage } from 'src/app/core/utils/images';

type EffectOptionType = 'attribute' | 'specialEffect';

export type EffectOutput = {
  name: Attribute | SpecialEffect;
  type: EffectOptionType;
};

type EffectOption = EffectOutput & {
  img: string;
  label?: string;
};

const specialEffects: Pick<EffectOption, 'name' | 'label'>[] = [
  {
    name: 'recharge',
    label: 'Healing',
  },
  {
    name: 'defIgnoring',
    label: 'DEF Ignoring special',
  },
  {
    name: 'multipleHits',
    label: 'Multiple hit special',
  }
];

@Component({
  selector: 'app-buff-picker',
  templateUrl: './buff-picker.component.html',
  styleUrls: ['./buff-picker.component.css']
})
export class BuffPickerComponent implements OnInit {

  @Output()
  public effectChange: EventEmitter<EffectOutput[]> = new EventEmitter<EffectOutput[]>();

  effects: EffectOutput[] = [];

  allEffects: EffectOption[] = [
    ...buffs.concat(debuffs).map(effect => ({
      name: effect,
      img: effectImage(effect),
      type: 'attribute' as EffectOptionType,
    })),
    ...specialEffects.map(se => ({
      ...se,
      img: effectImage(se.name),
      type: 'specialEffect' as EffectOptionType,
    })),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onEffectChange(): void {
    this.effectChange.emit(this.effects);
  }
}
