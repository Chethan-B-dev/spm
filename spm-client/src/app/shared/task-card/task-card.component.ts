import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { INotification } from "../interfaces/notification.interface";
import { ITask } from "../interfaces/task.interface";
import { ITodo } from "../interfaces/todo.interface";
import { NotificationService } from "../notification.service";
import { DataType, goBack, PieData } from "../utility/common";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input() task: ITask;
  @Input() showBackBtn: boolean;
  @Output() deleteTaskId = new EventEmitter<number>();

  constructor(private readonly notificationService: NotificationService) {}

  get pieChartData(): PieData<ITodo> {
    return { type: DataType.TODO, data: this.task.todos } as PieData<ITodo>;
  }

  deleteTask(): void {
    this.deleteTaskId.emit(this.task.id);
    this.sendDeletedNotification();
  }

  goBack(): void {
    goBack();
  }

  private sendDeletedNotification(): void {
    const notification: INotification = {
      userId: this.task.user.id,
      notification: `Your task: ${
        this.task.name
      } was deleted on ${new Date().toLocaleString()}`,
      time: Date.now(),
    };
    this.notificationService.addNotification(notification);
  }
}
