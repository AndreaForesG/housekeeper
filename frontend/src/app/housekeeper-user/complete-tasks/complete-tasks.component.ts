import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Room, Tasks} from "../dashboard-rooms/dashboard-rooms.component";
import {AuthService} from "../../services/auth.service";
import {RoomTaskLogsService} from "../../services/room-task-logs.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-complete-tasks',
  templateUrl: './complete-tasks.component.html',
  styleUrls: ['./complete-tasks.component.scss']
})
export class CompleteTasksComponent implements OnInit {

  filteredRooms: Room[] = [];
  noTasksToComplete:boolean = false;

  constructor(
    private roomTaskLogsService: RoomTaskLogsService,
    private dialogRef: MatDialogRef<CompleteTasksComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { rooms: Room[], userId: number }
  ) { }

  ngOnInit(): void {
    this.filteredRooms = this.data.rooms.filter(room => {
      if (room.user_id === this.data.userId && room.tasks && room.tasks.length > 0) {
        return room.tasks.some(task => task.log && !task.log.is_done);
      }
      return false;
    });
    this.noTasksToComplete = this.filteredRooms.every(room => {
      return room.tasks.every(task => task.log && task.log.is_done);
    });

  }


  submitTask(task: any) {
    const now = new Date();

    const pad = (n: number) => n.toString().padStart(2, '0');

    const completedAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
      ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;


    const payload = {
      room_task_id: task.room_task_id,
      task_id: task.task_id,
      user_id: this.data.userId,
      is_done: task.is_done_check,
      observation: task.observations ?? "",
      completed_at: completedAt
    };

    this.roomTaskLogsService.submitRoomTaskLog(payload).subscribe(
      (response) => {
        this.notificationService.showSuccess("Se ha completado la tarea con éxito.");
        this.dialogRef.close(true);
      },
      (error) => {
        this.notificationService.showError("Error al completar la tarea.")
      }
    );
  }

}
