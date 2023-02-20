import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {

  changeLogText: string;

  constructor(private http: HttpClient) { 
    this.changeLogText = 'Loading changelog...';
  }

  ngOnInit(): void {
    const options = {
      responseType: 'text' as const,
    };
    this.http.get('./CHANGELOG.md', options).subscribe(
      data => this.changeLogText = data,
      _ => this.changeLogText = 'Could not load changelog');
  }
}
