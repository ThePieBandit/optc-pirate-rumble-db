import { Classes } from 'src/app/shared/models/rumble';

// as of right now cant use the types on rumble.d.ts
// because they are surrounded with []
// but unit.stats.type does not have []
export const types = [
  '[STR]',
  '[DEX]',
  '[QCK]',
  '[PSY]',
  '[INT]',
  '[DUAL]'
];

export const classes: Classes[] = [
  'Fighter',
  'Slasher',
  'Striker',
  'Shooter',
  'Free Spirit',
  'Driven',
  'Cerebral',
  'Powerhouse',
];
