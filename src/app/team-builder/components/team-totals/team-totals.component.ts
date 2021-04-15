import { Component, Input, OnInit } from '@angular/core';
import * as rumble from '../../../shared/models/rumble';
import { TeamTotals } from '../../models/team-totals';

@Component({
  selector: 'app-team-totals',
  templateUrl: './team-totals.component.html',
  styleUrls: ['./team-totals.component.css']
})
export class TeamTotalsComponent implements OnInit {

  @Input()
  totals: TeamTotals;

  constructor() { }

  ngOnInit(): void {
  }

}
