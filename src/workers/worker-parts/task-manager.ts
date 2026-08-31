import { Task, JobType, TaskStatus } from "@dashboard/task";
import { getAvailableTaskWithHighestPriority } from "@dashboard/_dashboard";
import { Building } from "@aircraft/building";
import { Resource } from "@resources/resource";

const isTest = import.meta.env.MODE === "test";

export class TaskManager {
  task: Task | undefined;
  productionProgress = 60;

  constructor(public profession: string) {}

  public pickTask(currentPlatform: Building) {
    if (!this.task) {
      if (this.profession === "building") {
        this.task = this.takeTask(currentPlatform, JobType.building);
      } else if (this.profession === "delivering") {
        this.task = this.takeTask(currentPlatform, JobType.delivering);
      } else if (this.profession === "production") {
        this.task = this.takeTask(currentPlatform, JobType.production);
      }
    }
  }

  private takeTask(currentPlatform: Building, jobType: JobType) {
    const task = getAvailableTaskWithHighestPriority(currentPlatform, jobType);

    if (task) {
      task.status = TaskStatus.inProgress;
    }

    return task;
  }

  public handleProductionLogic(delta: number) {
    if (this.task) {
      if (!isTest) {
        this.productionProgress -= delta;

        if (this.productionProgress < 0) {
          this.tryToDoProduction();
        }
      } else {
        this.tryToDoProduction();
      }
    }
  }

  private tryToDoProduction() {
    if (this.task) {
      const result = this.task.target.tryToDoProduction();

      if (result) {
        this.resetProductionProgress();
      } else {
        this.task.status = TaskStatus.completed;
        this.task = undefined;
        this.resetProductionProgress();
      }
    }
  }

  private resetProductionProgress() {
    this.productionProgress = 60;
  }

  public handleResourceLogic(
    currentPlatform: Building,
    inventoryResource?: Resource,
  ) {
    const result = this.takeResource(currentPlatform);

    if (result) {
      return result;
    } else {
      this.giveResource(inventoryResource);
    }
  }

  private takeResource(currentPlatform: Building) {
    if (this.task?.reservedResource) {
      const resource = currentPlatform.takeResourceByType(
        this.task?.reservedResource,
      );

      this.task.reservedResource = undefined;
      return resource;
    }
  }
  private giveResource(inventoryResource?: Resource) {
    if (this.task && inventoryResource) {
      this.task.status = TaskStatus.completed;

      const wasAdded = this.task.target.tryToAddResource(
        inventoryResource,
        this.task,
      );

      if (!wasAdded) {
        this.task.status = TaskStatus.inProgress;
      } else {
        this.task = undefined;
      }
    }
  }
}
