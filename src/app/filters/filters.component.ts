import { Component, OnInit, Injectable } from '@angular/core';
import { UnitTableDataSource } from '../unit-table/unit-table-datasource';
import { Unit, Effect } from '../model/rumble';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  statType = 'RAW';
  statBaseValue = 'LEVEL';
  hideBaseForms = 'true';
  type = '';
  class = '';
  style = '';
  buffs = '';
  debuffs = '';
  damage = '';
  recharge = '';
  boons = '';
  hinderances = '';

  constructor(public dataService: UnitTableDataSource) { }

  ngOnInit(): void {
  }

  handleFormChange(formId: any): void{
    // this.dataService.statBaseSubject.next(formId.form.controls.statBaseValue.value);
    // this.dataService.statTypeSubject.next(formId.form.controls.statType.value);
    this.dataService.filterChainSubject.next(this.computeFilterChain(formId.form.controls));
    this.dataService.filterData();
  }

  computeFilterChain(formFields: any): ((unit: Unit) => boolean ) [] {
    const filterChain: ((unit: Unit) => boolean ) [] = [];
    if (formFields.hideBaseForms.value === 'true')
    {
      filterChain.push(unit => !unit.isBaseForm);
    }
    if ( Array.isArray(formFields.type.value) && formFields.type.value.length){
      filterChain.push(unit => formFields.type.value.includes(unit.stats.type));
    }
    if ( Array.isArray(formFields.class.value) && formFields.class.value.length){
      filterChain.push(unit => formFields.class.value.includes(unit.stats.class1) || formFields.class.value.includes(unit.stats.class2));
    }
    if ( Array.isArray(formFields.style.value) && formFields.style.value.length){
      filterChain.push(unit => formFields.style.value.includes(unit.stats.rumbleType)); // rename this later
    }
    if ( Array.isArray(formFields.buffs.value) && formFields.buffs.value.length){
      filterChain.push(this.unitFunc('buff', effect => effect.attributes
        .some(attribute => formFields.buffs.value.includes(attribute))));
    }
    if ( Array.isArray(formFields.debuffs.value) && formFields.debuffs.value.length){
      filterChain.push(this.unitFunc('debuff', effect => effect.attributes
        .some(attribute => formFields.debuffs.value.includes(attribute))));
    }
    if ( Array.isArray(formFields.damage.value) && formFields.damage.value.length){
      filterChain.push(this.unitFunc('damage',
                                     effect => formFields.damage.value.includes(effect.type)));
    }
    if ( Array.isArray(formFields.recharge.value) && formFields.recharge.value.length){
      filterChain.push(this.unitFunc('recharge',
                                     effect => formFields.recharge.value.includes(effect.type)));
    }
    if ( Array.isArray(formFields.boons.value) && formFields.boons.value.length){
      filterChain.push(this.unitFunc('boon', effect => effect.attributes
        .some(attribute => formFields.boons.value.includes(attribute))));
      }
    if ( Array.isArray(formFields.hinderances.value) && formFields.hinderances.value.length){
        filterChain.push(this.unitFunc('hinderance', effect => effect.attributes
          .some(attribute => formFields.hinderances.value.includes(attribute))));
        }
    return filterChain;
  }

  unitFunc(effectType: string, effectFunc: ((effect: Effect) => boolean)): ((unit: Unit) => boolean ) {

      return unit => unit.lvl5Ability
        .some(effect => effect.effect === effectType && effectFunc(effect))
        || unit.lvl10Special
          .some(effect => effect.effect === effectType && effectFunc(effect));
  }

}
