import { Injectable } from '@angular/core';
import { DynamicScriptLoaderService } from './dynamic-script-loader-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  units = [];

  constructor(public dynamicScriptLoader: DynamicScriptLoaderService) {

    for (var i = 0; i < window.units.length; i++){
      if(!window.details[i+1] || !window.details[i+1].festAbility || window.units[i].incomplete || window.units[i][0].includes('[Dual Unit] ')){
          continue;
      }
      let unit = {};
      console.log(i);

      unit.id = i+1;
      unit.name = window.units[i][0];
      unit.baseHp = window.units[i][12];
      unit.baseAtk = window.units[i][13];
      unit.baseRcv = window.units[i][14];
      unit.baseDef = window.festival[i][1];
      unit.baseSpd = window.festival[i][2];
      unit.rumbleType = window.festival[i][0];
      unit.type = Array.isArray(window.units[i][1]) ? "NONE" : window.units[i][1];
      unit.festAbility=window.details[i+1].festAbility;
      unit.festSpecial=window.details[i+1].festSpecial;
      unit.festAttackPattern=window.details[i+1].festAttackPattern;
      unit.festAttackTarget=window.details[i+1].festAttackTarget;
      this.units.push(unit);
   }
 }

  ngOnInit() {
     this.loadScripts();
  }
  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.load('units', 'details', 'festival').then(data => {
      console.log('OPTC DB Scripts loaded successfully');
    }).catch(error => console.log(error));
  }

   public getPFDetails():Array<{id, festAbility, festSpecial, festAttackPattern, festAttackTarget}>{
   return this.units;
 }
}
