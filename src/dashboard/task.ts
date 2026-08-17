import { Building } from "@aircraft/building";
import { aStar, dijkstra, buildPath } from "@utils/algorithms";
import { Resource } from "@resources/resource";

import { aircraft } from "@aircraft/aircraft";

export const JobType = {
  delivering: "delivering",
  building: "building",
  production: "production",
  defend: "defend",
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export const TaskStatus = {
  available: "available",
  inProgress: "inProgress",
  completed: "completed",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export class Task {
  status: TaskStatus = TaskStatus.available;
  reservedResource?: Resource;
  reservedAt?: Building;

  constructor(
    public target: Building,
    public jobType: JobType,
    public priority: number,
    public resource?: string,
  ) {}

  public getEffectivePriority() {
    return this.priority - this.target.resourceStorage.recources.length;
  }

  public getRouteForTarget(current: Building): Building[] {
    return aStar(current, this.target);
  }

  public getRouteForResource(
    start: Building,
    reserve: boolean,
  ): [Building[], Resource | undefined, number | undefined] {
    const { distances, previous } = dijkstra(start);
    const { distances: distancesToTarget } = dijkstra(this.target);

    let bestBuilding: Building | undefined = undefined;
    let bestDistance = Infinity;
    let bestResource: Resource | undefined = undefined;

    for (const building of aircraft.buildings) {
      if (building === this.target) continue;

      const resource = this.findNeededResource(building);

      if (resource) {
        const distanceToResource = distances.get(building);
        const distanceFromResourceToTarget = distancesToTarget.get(building);

        if (
          distanceToResource === undefined ||
          distanceFromResourceToTarget === undefined ||
          !Number.isFinite(distanceToResource) ||
          !Number.isFinite(distanceFromResourceToTarget)
        ) {
          continue;
        }

        const totalDistance = distanceToResource + distanceFromResourceToTarget;

        if (totalDistance < bestDistance) {
          bestDistance = totalDistance;
          bestBuilding = building;
          bestResource = resource;
        }
      }
    }

    if (!bestBuilding || !bestResource) return [[], undefined, undefined];

    if (reserve) {
      bestResource.isReserved = true;
      bestResource.isReservedForTransport = true;
      this.reservedResource = bestResource;
      this.reservedAt = bestBuilding;
      bestBuilding.refreshTasks();
    }

    return [buildPath(previous, bestBuilding), bestResource, bestDistance];
  }

  public releaseResourceReservation() {
    if (this.reservedResource) {
      this.reservedResource.isReserved = false;
      this.reservedResource.isReservedForTransport = false;
      this.reservedResource = undefined;
    }

    this.reservedAt = undefined;
  }

  private findNeededResource(building: Building): Resource | undefined {
    for (const resource of building.resourceStorage.recources) {
      if (resource.resourceType === this.resource && !resource.isReserved) {
        return resource;
      }
    }

    return undefined;
  }
}
