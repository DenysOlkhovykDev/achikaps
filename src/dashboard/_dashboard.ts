import { Task, JobType } from "@dashboard/task";
import { Building } from "@buildings/building";
import { dijkstra, getPathDistance } from "@utils/algorithms";
import { ResourceType } from "@resources/resource-types";

export const dashboard: Task[] = [];

export function addTask(
  target: Building,
  jobType: JobType,
  priority: number,
  resource?: ResourceType,
  countOfResources?: number,
) {
  if (resource !== undefined && countOfResources !== undefined) {
    const storedResources = target.getAvailableResourceCount(resource);
    const scheduledDeliveries = dashboard.filter(
      (task) =>
        task.target === target &&
        task.jobType === jobType &&
        task.resource === resource,
    ).length;
    const resourcesOnTheWay =
      jobType === JobType.delivering ? scheduledDeliveries : 0;

    if (storedResources + resourcesOnTheWay < countOfResources) {
      const task = new Task(target, jobType, priority, resource);
      dashboard.push(task);
      return task;
    }
  } else {
    const existingTask = dashboard.find(
      (task) => task.target === target && task.jobType === jobType,
    );

    if (existingTask) {
      return existingTask;
    }

    const task = new Task(target, jobType, priority);
    dashboard.push(task);
    return task;
  }
}

export function deleteTask(task: Task) {
  const index = dashboard.indexOf(task);

  if (index !== -1) {
    dashboard.splice(index, 1);
  }
}

export function getPossibleTaskWithHighestPriority(
  currentBuilding: Building,
  jobType: JobType,
) {
  const { distances } = dijkstra(currentBuilding);

  let bestTask: Task | undefined;
  let bestScore = -Infinity;

  for (const task of dashboard) {
    if (task.jobType !== jobType) continue;

    let totalDistance = distances.get(task.target) ?? Infinity;

    if (jobType === JobType.building || jobType === JobType.delivering) {
      const [path, resource, distanceToResource] =
        task.getRouteForResource(currentBuilding, false);

      if (
        path.length === 0 ||
        resource === undefined ||
        distanceToResource === undefined
      )
        continue;

      const resourceBuilding = path[path.length - 1];
      const deliveryPath = task.getRouteForTarget(resourceBuilding);

      if (deliveryPath.length === 0) {
        continue;
      }

      totalDistance = distanceToResource + getPathDistance(deliveryPath);
    }

    const score = task.priority - totalDistance;

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
