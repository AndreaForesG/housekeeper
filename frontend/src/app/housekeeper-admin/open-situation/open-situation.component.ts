import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {After} from "node:v8";
import {RoomsService} from "../../services/rooms.service";

@Component({
  selector: 'app-open-situation',
  templateUrl: './open-situation.component.html',
  styleUrls: ['./open-situation.component.scss']
})
export class OpenSituationComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['floor', 'number', 'assigned_to', 'taskStatus','status'];
  rooms : any[]= [];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedDate: string = new Date().toISOString().split('T')[0];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomsService: RoomsService
  ) {
    this.dataSource.data= data.dataHotel || [];  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  searchByDate() {
    if (this.selectedDate) {
      this.roomsService.getRoomsByHotelAndDate(this.data.hotelId, this.selectedDate).subscribe((result: any) => {
        this.dataSource.data = result;
      });
    }
  }

  hasPendingTasks(hab: any): boolean {
    return hab.tasks?.some((task: any) => task.log?.is_done === false);
  }


}
