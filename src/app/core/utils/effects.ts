
import * as rumble from '../../shared/models/rumble';
import { battleTime } from '../constants/battle';

export const isTeamEffect = (effect: rumble.Effect): boolean => {
  if (!effect) { return false; }
  switch (effect.effect) {
    case 'buff':
    case 'penalty':
      return true;
    default:
      return false;
  }
};

export const buffAppliesToTime = (effect: rumble.Effect, time: number): boolean => {
  if (!effect.condition || !effect.condition.count) { return true; }
  if (effect.condition.type !== 'time') { return true; }
  switch (effect.condition.comparator) {
    case 'first': return time >= battleTime - effect.condition.count;
    case 'after': return time <= battleTime - effect.condition.count;
    case 'remaining': return time <= effect.condition.count;
  }
  return false;
};

export const buffAppliesToUnit = (effect: rumble.Effect, unit: rumble.Unit): boolean => {
  if (!unit || !effect) { return false; }
  if (!effect.targeting) { return true; }
  if (!effect.targeting.targets || effect.targeting.targets.length === 0) { return true; }
  return effect.targeting.targets.some(t =>
    t === 'crew' ||
    unit.stats && (
      t === unit.stats.class1 ||
      t === unit.stats.class2 ||
      t === `[${unit.stats.type}]`
    )
  );
};

export const isHpBasedEffect = (effect: rumble.Effect): boolean =>
  effect &&
  effect.condition &&
  effect.condition.type === 'stat' &&
  effect.condition.stat === 'HP';

export const effectAppliesToUnitHp = (effect: rumble.Effect, hp: number): boolean => {
  if (!effect) { return false; }
  if (!isHpBasedEffect(effect)) { return true; }
  switch (effect.condition.comparator) {
    case 'above':
      return hp >= effect.condition.count;
    case 'below':
      return hp <= effect.condition.count;
    default:
      console.warn('received effect that is based on HP but have no switch case for it');
      return true;
  }
};
