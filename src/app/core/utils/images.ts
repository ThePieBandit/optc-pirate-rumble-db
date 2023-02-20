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
    case 'Confusion': return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABDVJREFUaEPtWUtOVUEQPWfuPzpWVqDsAOcm6lwjDP1FiQtQNqAQI1NRFyAkzsUVCCsQxn4AWUCZQ+qafn277+37eRgSKyEPuO911ak69el6xAkXnnD78R/Av47gaBEws2sAbgLQ6xV/DfFtAdgBsAngC0n9PVgGATAzGfoEwC03uotBArMOYIWkfu8lvQCY2TkAzwE87aW1/qFlAEsk97ue1xmAmcnbbwEIxJgi4xdIKirF0gmAmb1q8fqG00KU2K947vkhwKKcHKBcyckyycVSBEUAnDLyupTHcuCg1ksp4OfpLFHnbOLMNQCLJeeVAviYMX5JRpQoSnnUgSiPlE+xrJFcaItEKwAzk5dUaUKR1+fGKoVOMZXXOBqqUI2FohGAJ6y8H8q2G9+5YjR500uyEvhq9L7bTYmdBeDh/RZVG3n+Sl/KtNHBQajBhZGQo2ZyOpsAKJHuRUpnx6JNDozT6Wv0PEulJAD3hLwfihrNizYvjvHczKQnTmxFodaxcwDixJ0qdWLQTl8ZG1Ip6cAcAHlfTacSdUhR6tjEzOa941c6d0jOxAbUAGQ4eD6VRGb2BsBdP/QDyYclCM1s1T9nAN6RfJyJwl5bDqYAxPzbIFnrwG78g0jBahsIN/5+SZKamcpqOHaoO4vefyUFIP5Qkj5m9hvA6ciQQ5JnmqJgZocATkXv+UnyYiIKamKavyqpOTMFQCVMl5JKrpNUl5yQAQBSwH+QvJTQMQfgc/D/LZKzbREQL0NJ1v4BFHoN4FGk4yXJZwkAcuRETyA54fRUBCYAxB8IlQxIYvH4DgDpep8yvtJjZo32DALQxPWxng0GAGDq40MObKqkl1BIw1Q4ESaTeCwPt1SsOIm3SYYFpr7YStTeY+/CAf97ldGiRlYaATNTebzso4nGk+r3GwBqZTEqEr0aWa10AUiOElLWYGBlaNzsQhv3SF5IOcMHuu6jhBulSVAGVJLrximwpcGp3pebs+JhbpdkOGAefb50nE7eijJe6gqgVuUyt8FO47SQFl1ozOyXKNZgtWYfRXQ3ej36H8nviQ487ELjNCq6UppZNTt9KjWwpXSmaNntSukAtEmLb0WNF+yu3El4XpGXQ8K1ZeNtsM9aRY1Oq47eG+VM1ZHxWuFMNCrXld2X9l1sKRLq0KPs+H1k0NgcL4yHLbaCjpjKBz1WsklJryWXVxtt/VLbDl01VUobpTUCQT5oBI73RHos49XydVsqAuKG66qoM1Nr+nc6s+S8IgBBJFJ70tBD4qp+lB8H0XpdKxLxWwNaastdndNKm1BhJwAeDSkXpVJr8baINz1XtZmf6hccQSQUdvE23lr3BbCi80ooEyvoHIHwAF9Biv+KSjg7lQBRZ1Yk9T1A75I8CEAEpuK3OK6aHq/JtZavvmbdHKsEjwagxOXTeM9/ANPwapczT3wE/gCBG/BAmNEe9QAAAABJRU5ErkJggg==';
    case 'Counter': return 'assets/images/nao.png';
    case 'defIgnoring': return 'assets/images/ignore_def.png';
    case 'multipleHits': return 'assets/images/eot_dmg.png';
    case 'recharge': return 'assets/images/healing.png';
    case 'Provoke': return 'assets/images/pirates_arena_effect_icon_taunt.png';
    case 'Action Bind': return 'assets/images/pirates_arena_effect_icon_action_cancel.png';
    case 'Silence': return 'assets/images/pirates_arena_effect_icon_special_cancel.png';
    case 'Haste': return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAASJJREFUaEPtl9ENwjAMRO82hA1gA9ig3QQmgBFgA0aADWCCICNaUZRKda2IWDjfjuV3l2tSwvmi8/kRAL92MBwIB4wKxBEyCmjeHg6YJTQ2CAeMApq3/68DKaUdgA3Ju0bGlFL6rCdpEnH25vcgVwBLkpepELUBdHM3JNspELUCyOwnAGuS4sroqhlAhpY8CMRxjKB2gG5uCfg2F3AvAAKSDbgngGzAPQIMAu4VoA84gENNF9mUT39X8wCw8gpwluHljvB4hFqSTWeDJ4AbgMX3O8kLwH7spVo7wCuoXp8SfVA9PuYGQfUEkA2qFwDfv5SaK7hk7ex/4pJDaXoHgEatErXhQAlVNT3DAY1aJWrDgRKqanqGAxq1StSGAyVU1fR8AnkzujGQ5of0AAAAAElFTkSuQmCC';
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






