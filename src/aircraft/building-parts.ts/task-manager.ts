import { Building } from "@aircraft/building";
import { Task, JobType } from "@dashboard/task";
import { addTask, dashboard, deleteTask } from "@dashboard/_dashboard";

export class TaskManager {
  tasks: Task[] = [];

  public refreshTasks(building: Building) {
    this.syncProductionTask(building);

    this.syncDeliveryTask(building);
  }

  private syncProductionTask(building: Building) {
    if (!building.canProduce()) {
      for (const task of this.tasks) {
        if (!task.inProgress) {
          deleteTask(task);
        }
      }
      return;
    }

    if (this.tasks.length === 0) {
      addTask(building, JobType.production, building.priorityForTasks);
      return;
    }
  }

  private canProduce() {}

  private syncDeliveryTask(building: Building) {}
}
