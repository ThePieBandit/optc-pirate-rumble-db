import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionStorage } from 'ngx-store';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {

  error = false;

  @SessionStorage()
  changeLogText: string = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.changeLogText != null) {
      return;
    }
    const options = {
      responseType: 'text' as const,
    };
    this.http.get('./CHANGELOG.md', options).subscribe(
      data => this.changeLogText = data,
      _ => this.error = true);
  }
}
