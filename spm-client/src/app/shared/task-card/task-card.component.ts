import { Component, EventEmitter, Input, Output } from "@angular/core";
import { INotification } from "../interfaces/notification.interface";
import { ITask } from "../interfaces/task.interface";
import { ITodo } from "../interfaces/todo.interface";
import { NotificationService } from "../notification.service";
import { DataType, goBack, PieData } from "../utility/common";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent {
  @Input() task: ITask;
  @Input() showBackBtn: boolean;
  @Output() deleteTaskId = new EventEmitter<number>();

  constructor(private readonly notificationService: NotificationService) {}

  deleteTask(): void {
    this.deleteTaskId.emit(this.task.id);
    const notification: INotification = {
      userId: this.task.user.id,
      notification: `Your task: ${
        this.task.name
      } was deleted on ${new Date().toLocaleString()}`,
      time: Date.now(),
    };
    this.notificationService.addNotification(notification);
  }

  get pieChartData(): PieData<ITodo> {
    return { type: DataType.TODO, data: this.task.todos } as PieData<ITodo>;
  }

  goBack(): void {
    goBack();
  }
}
