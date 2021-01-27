import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { UnitTableDataSource } from './unit-table-datasource';
import { Unit } from '../model/rumble';

@Component({
  selector: 'app-unit-table',
  templateUrl: './unit-table.component.html',
  styleUrls: ['./unit-table.component.css']
})
export class UnitTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Unit>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'type', 'baseHp', 'baseAtk', 'baseRcv', 'baseDef', 'baseSpd', 'lvl10Special', 'lvl10Cooldown', 'lvl5Ability'];

  constructor(public dataSource: UnitTableDataSource) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'baseHp': return item.stats.hp;
        case 'baseAtk': return item.stats.atk;
        case 'baseRcv': return item.stats.rcv;
        case 'baseDef': return item.stats.def;
        case 'baseSpd': return item.stats.spd;
        case 'type': return item.stats.type;
        case 'rumbleType': return item.stats.rumbleType;

        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
