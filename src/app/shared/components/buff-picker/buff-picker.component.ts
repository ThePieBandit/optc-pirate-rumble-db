import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { buffs } from 'src/app/core/constants/effects';
import { buffImage } from 'src/app/core/utils/images';

interface Buff {
  name: string;
  img: string;
}

@Component({
  selector: 'app-buff-picker',
  templateUrl: './buff-picker.component.html',
  styleUrls: ['./buff-picker.component.css']
})
export class BuffPickerComponent implements OnInit {

  @Output()
  public buffChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input()
  public buff: string[] = [];

  buffs: Buff[] = buffs.map(buff => ({
    name: buff,
    img: buffImage(buff),
  }));

  constructor() { }

  ngOnInit(): void {
  }

  change(): void {
    this.buffChange.emit(this.buff);
  }

}
