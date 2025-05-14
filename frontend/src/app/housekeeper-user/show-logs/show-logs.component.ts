import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoomTaskLogsService} from "../../services/room-task-logs.service";
import {Observable} from "rxjs";
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from "@angular/material/table";
import {LogModel} from "../../models/log.model";


@Component({
  selector: 'app-show-logs',
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.scss']
})


export class ShowLogsComponent implements OnInit, AfterViewInit {

  hotelId: any;
  roleId: number | undefined;
  userId: number | undefined;
  logs$: Observable<LogModel[]> | undefined;
  displayedColumns: string[] = ['task_name', 'user_name', 'observation', 'is_done', 'completed_at'];
  dataSource = new MatTableDataSource<LogModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ShowLogsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {hotelId: any, dataUser: any },
    private roomTasksLogService: RoomTaskLogsService,
  ) { }

  ngOnInit(): void {
    this.hotelId = this.data.hotelId;
    this.userId = this.data.dataUser.id;
    this.roleId = this.data.dataUser.role_id;
    this.loadLogs();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }


  loadLogs() {
    this.logs$ = this.roomTasksLogService.getLogsForHotel(this.hotelId);
    this.logs$.subscribe(logs => {
      if (this.roleId !== 3) {
        logs = logs.filter(log => log.user_id === this.userId);
      }

      logs.sort((a, b) => {
        return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
      });

      this.dataSource.data = logs;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });

  }


  closeDialog() {
    this.dialogRef.close()
  }
}
