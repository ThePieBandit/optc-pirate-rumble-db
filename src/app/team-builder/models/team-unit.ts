import { UnitDetails } from 'src/app/shared/models/unit-details';

export interface TeamUnit extends UnitDetails {
  hp: number;
  cooldown: number;
  maxCooldown: number;
  activeSpecial: boolean;
  leader?: boolean;
}
