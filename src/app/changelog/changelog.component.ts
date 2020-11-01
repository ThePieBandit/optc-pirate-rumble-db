import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {

  changeLogText = 'Could not load changelog';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const options = {
      responseType: 'text' as const,
    };
    this.http.get('./CHANGELOG.md', options).subscribe(data => this.changeLogText = data);
  }

  public getChangeLog(): string {
    return this.changeLogText;
  }

}
