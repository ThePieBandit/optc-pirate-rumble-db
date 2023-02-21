import { SpecialEffect } from "@core/constants/effects";
import { Attribute, EffectEnum, RumbleType } from "@shared/models/rumble";

export const typeImage = (type: string): string => {
  if (!type.startsWith('[')) {
    type = `[${type}]`;
  }
  switch (type) {
    case '[STR]': return 'assets/images/filter_attribute_power.png';
    case '[DEX]': return 'assets/images/filter_attribute_technical.png';
    case '[QCK]': return 'assets/images/filter_attribute_speed.png';
    case '[PSY]': return 'assets/images/filter_attribute_heart.png';
    case '[INT]': return 'assets/images/filter_attribute_intellect.png';
    case '[DUAL]': return 'assets/images/filter_attribute_multiplecharacter.png';
    default: return '';
  }
};

export const classImage = (type: string): string => {
  switch (type) {
    case 'Fighter': return 'assets/images/filter_type_icn_1.png';
    case 'Slasher': return 'assets/images/filter_type_icn_2.png';
    case 'Striker': return 'assets/images/filter_type_icn_3.png';
    case 'Shooter': return 'assets/images/filter_type_icn_4.png';
    case 'Free Spirit': return 'assets/images/filter_type_icn_5.png';
    case 'Driven': return 'assets/images/filter_type_icn_6.png';
    case 'Cerebral': return 'assets/images/filter_type_icn_7.png';
    case 'Powerhouse': return 'assets/images/filter_type_icn_8.png';
    default: return '';
  }
};

export const effectImage = (effect: Attribute | SpecialEffect | EffectEnum): string => {
  switch (effect) {
    case 'ATK': return 'assets/images/pirates_arena_attack_up.png';
    case 'HP': return 'assets/images/pirates_arena_strength_up.png';
    case 'RCV': return 'assets/images/pirates_arena_cure_up.png';
    case 'DEF': return 'assets/images/pirates_arena_defence_up.png';
    case 'SPD': return 'assets/images/pirates_arena_speed_up.png';
    case 'Critical Hit': return 'assets/images/pirates_arena_critical_up.png';
    case 'Guard': return 'assets/images/pirates_arena_guard_up.png';
    case 'Accuracy': return 'assets/images/pirates_arena_miss_up.png';
    case 'Blow Away': return 'assets/images/pirates_arena_KnockBack_up.png';
    case 'Special CT': return 'assets/images/pirates_arena_SP_speed_up.png';
    case 'Half Stats': return 'assets/images/half_stats.png';
    case 'Shield': return 'assets/images/shield.png';
    case 'Confusion': return 'assets/images/confusion.png';
    case 'Counter': return 'assets/images/nao.png';
    case 'defIgnoring': return 'assets/images/ignore_def.png';
    case 'multipleHits': return 'assets/images/eot_dmg.png';
    case 'recharge': return 'assets/images/healing.png';
    case 'Provoke': return 'assets/images/pirates_arena_effect_icon_taunt.png';
    case 'Action Bind': return 'assets/images/pirates_arena_effect_icon_action_cancel.png';
    case 'Silence': return 'assets/images/pirates_arena_effect_icon_special_cancel.png';
    case 'Haste': return 'assets/images/haste.png';
    default: return '';
  } 
};

export const rumbleTypeImage = (rumbleType: RumbleType): string => {
  switch (rumbleType) {
    case 'ATK': return 'assets/images/filter_style_icon_01.png';
    case 'DEF': return 'assets/images/filter_style_icon_02.png';
    case 'RCV': return 'assets/images/filter_style_icon_03.png';
    case 'SPT': return 'assets/images/filter_style_icon_04.png';
    case 'DBF': return 'assets/images/filter_style_icon_05.png';
    default:
      console.warn('unexpected rumble type ' + rumbleType);
      return rumbleType;
  }
};






