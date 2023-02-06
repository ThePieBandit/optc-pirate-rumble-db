import { Attribute, EffectEnum } from 'src/app/shared/models/rumble';

export const buffs: Attribute[] = [
  'ATK',
  'HP',
  'RCV',
  'DEF',
  'SPD',
  'Critical Hit',
  'Guard',
  'Accuracy',
  'Blow Away',
  'Special CT',
  //"Shield", // enable later when more units have it
  'Counter',
];

export const debuffs: Attribute[] = [
  "Half Stats",
  //"Confusion", // enable later when more units have it
];

export type SpecialEffect = 'defIgnoring'
  | 'multipleHits'
  | EffectEnum;
