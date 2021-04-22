import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  @Input() student: string;

  constructor() { }

  ngOnInit(): void {
  }

}
