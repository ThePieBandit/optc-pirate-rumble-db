import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangelogComponent } from '../changelog/changelog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input()
  barTitle = 'OPTC Pirate Rumble Database';
  
  @Output()
  public menuToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  toggle() {
    this.menuToggle.emit(true);
  }

  openInfo() {
    this.dialog.open(ChangelogComponent);
  }
}
