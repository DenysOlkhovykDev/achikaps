import type { Building } from "@aircraft/building";
import { Task, JobType, TaskStatus } from "@dashboard/task";
import { dashboard } from "@dashboard/_dashboard";

export class TaskManager {
  readonly deliveringTasks: Task[] = [];
  readonly productionTasks: Task[] = [];
  readonly buildingTasks: Task[] = [];

  constructor(private readonly building: Building) {}

  public addTasks(
    jobType: JobType,
    priority: number,
    resource?: string,
    count = 1,
  ) {
    const taskCount = resource ? count : 1;
    const tasks: Task[] = [];

    if (
      taskCount <= 0 ||
      (jobType === JobType.production && !this.building.craft)
    ) {
      return tasks;
    }

    const taskList = this.getTaskList(jobType);

    for (let i = 0; i < taskCount; i++) {
      const task = new Task(this.building, jobType, priority, resource);

      taskList.push(task);
      dashboard.push(task);
      tasks.push(task);
    }

    return tasks;
  }

  public cancelTask(task: Task) {
    if (task.status === TaskStatus.inProgress) return false;

    this.removeTask(task);
    return true;
  }

  public refreshTasks() {
    this.removeCompletedTasks();

    if (!this.building.craft || this.building.priorityForTasks < 0) return;

    this.syncDeliveryTasks();
    this.syncProductionTask();
  }

  private removeCompletedTasks() {
    for (const taskList of this.getTaskLists()) {
      for (const task of [...taskList]) {
        if (task.status === TaskStatus.completed) {
          this.removeTask(task);
        }
      }
    }
  }

  private syncDeliveryTasks() {
    const requiredResources = this.building.getRequiredResourceCounts();
    const missingResources = [...requiredResources].map(
      ([resourceName, requiredCount]) => ({
        resourceName,
        count: Math.max(
          0,
          requiredCount -
            this.building.resourceStorage.getAvailableResourceCount(
              resourceName,
            ),
        ),
      }),
    );
    const totalMissingResources = missingResources.reduce(
      (total, resource) => total + resource.count,
      0,
    );
    const canFitMissingResources =
      totalMissingResources <=
      this.building.inventorySize -
        this.building.resourceStorage.recources.length;

    for (const missingResource of missingResources) {
      const tasks = this.deliveringTasks.filter(
        (task) => task.resource === missingResource.resourceName,
      );
      const inProgressCount = tasks.filter(
        (task) => task.status === TaskStatus.inProgress,
      ).length;
      const desiredTaskCount = canFitMissingResources
        ? missingResource.count
        : inProgressCount;
      const desiredAvailableCount = Math.max(
        0,
        desiredTaskCount - inProgressCount,
      );
      const availableTasks = tasks.filter(
        (task) => task.status === TaskStatus.available,
      );

      for (const task of availableTasks.slice(desiredAvailableCount)) {
        this.removeTask(task);
      }

      const tasksToCreate = desiredAvailableCount - availableTasks.length;

      if (tasksToCreate > 0) {
        this.addTasks(
          JobType.delivering,
          this.building.priorityForTasks,
          missingResource.resourceName,
          tasksToCreate,
        );
      }
    }
  }

  private syncProductionTask() {
    if (!this.building.canProduce()) {
      for (const task of [...this.productionTasks]) {
        if (task.status === TaskStatus.available) {
          this.removeTask(task);
        }
      }

      return;
    }

    if (
      this.deliveringTasks.length === 0 &&
      this.productionTasks.length === 0
    ) {
      this.addTasks(JobType.production, this.building.priorityForTasks);
    }
  }

  private removeTask(task: Task) {
    task.releaseResourceReservation();

    const taskList = this.getTaskList(task.jobType);
    const localIndex = taskList.indexOf(task);
    if (localIndex !== -1) {
      taskList.splice(localIndex, 1);
    }

    const dashboardIndex = dashboard.indexOf(task);
    if (dashboardIndex !== -1) {
      dashboard.splice(dashboardIndex, 1);
    }
  }

  private getTaskList(jobType: JobType) {
    if (jobType === JobType.delivering) return this.deliveringTasks;
    if (jobType === JobType.production) return this.productionTasks;
    if (jobType === JobType.building) return this.buildingTasks;

    return [];
  }

  private getTaskLists() {
    return [this.deliveringTasks, this.productionTasks, this.buildingTasks];
  }
}
