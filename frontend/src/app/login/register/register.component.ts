import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private titleService: Title,
              private route: ActivatedRoute,) {

  }
  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
    this.titleService.setTitle(data.title);
  });
  }


}
