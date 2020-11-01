import { Component, OnInit, Injectable } from '@angular/core';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class OptionBarComponent implements OnInit {

  statType:string = 'RAW';

  constructor() { }

  ngOnInit(): void {
  }

  public isComputedStats():boolean {
    return 'COMPUTED' == this.statType;
  }

}
