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
  if (jobType === JobType.production) {
    if (!target.craft) return undefined;

    const existingTask = dashboard.find(
      (task) =>
        task.target === target && task.jobType === JobType.production,
    );

    if (existingTask) return existingTask;
  }

  const count = resource ? (countOfResources ?? 1) : 1;
  if (count <= 0) return undefined;

  let firstTask: Task | undefined;

  for (let i = 0; i < count; i++) {
    const task = new Task(target, jobType, priority, resource);
    dashboard.push(task);
    firstTask ??= task;
  }

  return firstTask;
}

export function deleteTask(task: Task) {
  task.releaseResourceReservation();
  task.inProgress = false;

  const index = dashboard.indexOf(task);

  if (index !== -1) {
    dashboard.splice(index, 1);
  }
}

export function releaseTask(task: Task) {
  task.releaseResourceReservation();
  task.inProgress = false;
}

export function getPosibleTaskWithHighestPriority(
  currentBuilding: Building,
  jobType: JobType,
) {
  const { distances } = dijkstra(currentBuilding);

  let bestTask: Task | undefined;
  let bestPriority = -Infinity;
  let bestDistance = Infinity;

  for (const task of dashboard) {
    if (task.jobType !== jobType || task.inProgress) continue;

    let totalDistance: number;

    if (jobType === JobType.building || jobType === JobType.delivering) {
      const [path, resource, distance] =
        task.getRouteForResource(currentBuilding, false);

      if (
        path.length === 0 ||
        resource === undefined ||
        distance === undefined
      )
        continue;

      totalDistance = distance;
    } else {
      const distanceToTask = distances.get(task.target);
      if (distanceToTask === undefined || !Number.isFinite(distanceToTask)) {
        continue;
      }

      totalDistance = distanceToTask;
    }

    const effectivePriority = task.getEffectivePriority();

    if (
      effectivePriority > bestPriority ||
      (effectivePriority === bestPriority && totalDistance < bestDistance)
    ) {
      bestPriority = effectivePriority;
      bestDistance = totalDistance;
      bestTask = task;
    }
  }

  if (bestTask) {
    bestTask.inProgress = true;
  }

  return bestTask;
}
