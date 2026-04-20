import { Task, JobType } from "@dashboard/task";
import { Building } from "@buildings/building";
import { dijkstra } from "@utils/algorithms";

export const dashboard: Task[] = [];

export function addTask(
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
        const task = new Task(target, jobType, priority, resource);
        dashboard.push(task);
        return task;
      }
    }
  } else {
    const task = new Task(target, jobType, priority);
    dashboard.push(new Task(target, jobType, priority));
    return task;
  }
}

export function deleteTask(task: Task) {
  const index = dashboard.indexOf(task);

  if (index !== -1) {
    dashboard.splice(index, 1);
  }
}

export function getPosibleTaskWithHighestPriority(
  currentBuilding: Building,
  jobType: JobType,
) {
  const { distances } = dijkstra(currentBuilding);

  let bestTask: Task | undefined;
  let bestScore = -Infinity;

  for (const task of dashboard) {
    if (task.jobType !== jobType) continue;

    if (jobType === JobType.building || jobType === JobType.delivering) {
      const [path, resourceIndex] = task.getRouteForResource(
        currentBuilding,
        false,
      );

      if (path.length === 0 || resourceIndex === undefined) continue;
    }

    const distanceToTask = distances.get(task.target)!;
    const score = task.priority - distanceToTask;

    if (score > bestScore) {
      bestScore = score;
      bestTask = task;
    }
  }

  if (bestTask) {
    deleteTask(bestTask);
  }

  return bestTask;
}
