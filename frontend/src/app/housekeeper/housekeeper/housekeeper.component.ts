import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateEmployeesComponent} from "../create-employees/create-employees.component";

@Component({
  selector: 'app-housekeeper',
  templateUrl: './housekeeper.component.html',
  styleUrls: ['./housekeeper.component.scss']
})
export class HousekeeperComponent implements OnInit {

  isExpanded = true;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private dialog: MatDialog,) { }


  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.titleService.setTitle(data.title);
    });
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  createEmployees() {
    const dialogRef = this.dialog.open(CreateEmployeesComponent)

  }


}
