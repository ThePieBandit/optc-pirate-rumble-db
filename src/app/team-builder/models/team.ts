import { Effect } from '@shared/models/rumble';
import { TeamTotals } from './team-totals';
import { TeamUnit } from './team-unit';

export type TeamType = 'normal' | 'gp';

export interface Team {
  color: string;
  main: TeamUnit[];
  subs: TeamUnit[];
  effects: Effect[];
  totals: TeamTotals;
  number?: number;
  type: TeamType;
}
