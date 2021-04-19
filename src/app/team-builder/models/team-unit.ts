import { Unit } from 'src/app/shared/models/rumble';

export interface TeamUnit extends Unit {
  hp: number;
  cooldown: number;
  maxCooldown: number;
}
