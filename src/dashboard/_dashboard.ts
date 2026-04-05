import { Task, JobType } from "@dashboard/task";
import { Building } from "@buildings/building";

import { buildings } from "@buildings/_buildings";

export class DashBoard {
  tasks: Task[] = [];

  public addTask(
    target: Building,
    jobType: JobType,
    priority: number,
    resource?: string,
    countOfResources?: number,
  ) {
    if (resource && countOfResources) {
      const result: Record<string, number> = {};

      target.recources.forEach((element) => {
        if (!result[element.constructor.name]) {
          result[element.constructor.name] = 0;
        }
        if (!element.isReserved) {
          result[element.constructor.name]++;
        }
      });

      if (!result[resource]) {
        result[resource] = 0;
      }

      if (countOfResources - result[resource] > 0) {
        for (let i = 0; i < countOfResources - result[resource]; i++) {
          this.tasks.push(new Task(target, jobType, priority, resource));
        }
      }
    } else {
      this.tasks.push(new Task(target, jobType, priority));
    }
  }

  public deleteTask(task: Task) {
    const index = this.tasks.indexOf(task);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  // rework
  public getPosibleTaskWithHighestPriority(
    currentBuilding: Building,
    jobType: JobType,
  ) {
    const dist = new Map();
    const visited = new Set();

    for (const b of buildings) {
      dist.set(b, Infinity);
    }

    dist.set(currentBuilding, 0);

    let bestTask = undefined;
    let bestScore = -Infinity;

    while (true) {
      let current = undefined;

      for (const [b, d] of dist) {
        if (
          !visited.has(b) &&
          (current === undefined || d < dist.get(current))
        ) {
          current = b;
        }
      }

      if (!current) break;

      visited.add(current);

      const currentDist = dist.get(current);

      // перевіряємо задачі
      for (const task of this.tasks) {
        if (task.target === current && task.jobType === jobType) {
          const score = task.priority - currentDist;

          if (score > bestScore) {
            bestScore = score;
            bestTask = task;
          }
        }
      }

      // релаксація
      for (const next of current.links) {
        const weight = 1; // або твоя реальна вага

        const newDist = currentDist + weight;

        if (newDist < dist.get(next)) {
          dist.set(next, newDist);
        }
      }
    }

    if (bestTask) {
      this.deleteTask(bestTask);
    }

    return bestTask;
  }
}

export const dashboard = new DashBoard();
