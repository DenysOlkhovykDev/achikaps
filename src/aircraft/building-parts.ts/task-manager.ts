import { Task } from "@dashboard/task";

export class TaskManager {
  tasks: Task[] = [];

  public refreshTasks() {
    this.syncProductionTask();

    this.syncDeliveryTask();
  }

  private syncProductionTask() {}

  private canProduce() {}

  private syncDeliveryTask() {}
}
