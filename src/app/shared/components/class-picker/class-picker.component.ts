import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { classes } from 'src/app/core/constants/units';
import { classImage } from 'src/app/core/utils/images';

interface UnitClass {
  name: string;
  img: string;
}

@Component({
  selector: 'app-class-picker',
  templateUrl: './class-picker.component.html',
  styleUrls: ['./class-picker.component.css']
})
export class ClassPickerComponent implements OnInit {

  @Output()
  public classChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  class: string[] = [];

  classes: UnitClass[] = classes.map(c => ({
    name: c,
    img: classImage(c),
  }));

  constructor() {
  }

  ngOnInit(): void {
    this.class = [];
  }

  change(): void {
    this.classChange.emit(this.class);
  }
}
