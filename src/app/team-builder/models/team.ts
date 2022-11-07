import { Effect } from '@shared/models/rumble';
import { TeamTotals } from './team-totals';
import { TeamUnit } from './team-unit';

export interface Team {
  color: string;
  main: TeamUnit[];
  subs: TeamUnit[];
  effects: Effect[];
  totals: TeamTotals;
  number?: number;
}
