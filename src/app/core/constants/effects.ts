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
];

// some effects like Counter are considered attributes even
// though they are not buffs with levels
export const nonLevelBuffs: Attribute[] = [
  'Provoke',
  'Counter',
  'Haste',
];

export const debuffs: Attribute[] = [
  "Silence",
  "Action Bind",
  "Half Stats",
  "Confusion",
];

export type SpecialEffect = 'defIgnoring'
  | 'multipleHits'
  | EffectEnum;
